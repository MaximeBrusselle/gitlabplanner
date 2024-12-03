import { db } from "@db/index";
import { usersTable, organizationsTable, organizationMembersTable } from "@db/schema";
import { eq, and, isNull, inArray } from "drizzle-orm";
import type { User, Organization, PaginatedResponseJSON } from "@clerk/backend";
import type { OrganizationMembership } from "@clerk/astro/server";

async function syncUserToDatabase(userId: string, user: User) {
    const existingUser = await db.select()
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .limit(1);

    if (existingUser.length === 0) {
        await db.insert(usersTable).values({
            id: userId,
            name: `${user.firstName} ${user.lastName}`.trim() || user.username || 'Anonymous',
            email: user.emailAddresses[0].emailAddress,
            createdAt: new Date().toISOString(),
            lastSignIn: new Date().toISOString(),
            imageUrl: user.imageUrl,
        });
        return;
    }
    await db.update(usersTable)
        .set({
            lastSignIn: new Date().toISOString(),
            name: `${user.firstName} ${user.lastName}`.trim() || user.username || 'Anonymous',
            email: user.emailAddresses[0].emailAddress,
            imageUrl: user.imageUrl,
        })
        .where(eq(usersTable.id, userId));
}

async function syncOrganizationsToDatabase(organizations: { data: OrganizationMembership[] }) {
    for (const org of organizations.data) {
        const orgId = org.organization.id;
        const role = org.role;
        const existingOrg = await db.select()
            .from(organizationsTable)
            .where(eq(organizationsTable.id, orgId))
            .limit(1);

        if (existingOrg.length === 0) {
            await db.insert(organizationsTable).values({
                id: orgId,
                name: org.organization.name,
            });
            return;
        }
        await db.update(organizationsTable)
            .set({ name: org.organization.name })
            .where(eq(organizationsTable.id, orgId));
    }
}

async function syncOrganizationMembersToDatabase(userId: string, organizations: { data: OrganizationMembership[] }) {
    const existingMemberships = await db.select()
        .from(organizationMembersTable)
        .where(eq(organizationMembersTable.userId, userId));

    const currentOrgIds = new Set(organizations.data.map(org => org.organization.id));

    for (const membership of existingMemberships) {
        if (!currentOrgIds.has(membership.organizationId)) {
            await db.delete(organizationMembersTable)
                .where(
                    and(
                        eq(organizationMembersTable.organizationId, membership.organizationId),
                        eq(organizationMembersTable.userId, userId)
                    )
                );
        }
    }

    for (const org of organizations.data) {
        const existingMember = await db.select()
            .from(organizationMembersTable)
            .where(and(eq(organizationMembersTable.organizationId, org.organization.id), eq(organizationMembersTable.userId, userId)))
            .limit(1);

        if (existingMember.length === 0) {
            await db.insert(organizationMembersTable).values({
                organizationId: org.organization.id,
                userId: userId,
                createdAt: new Date().toISOString(),
            });
        }
    }
}

async function deleteUnusedOrganizations() {
    const orgsWithoutMembers = await db
        .select({ id: organizationsTable.id })
        .from(organizationsTable)
        .leftJoin(
            organizationMembersTable,
            eq(organizationsTable.id, organizationMembersTable.organizationId)
        )
        .where(isNull(organizationMembersTable.organizationId));

    if (orgsWithoutMembers.length > 0) {
        const orgIdsToDelete = orgsWithoutMembers.map(org => org.id);
        await db.delete(organizationsTable)
            .where(inArray(organizationsTable.id, orgIdsToDelete));
    }
}

export async function syncDataToDatabase(
    userId: string,
    user: User,
    organizations: { data: OrganizationMembership[] }
) {
    try {
        await syncUserToDatabase(userId, user);
        await syncOrganizationsToDatabase(organizations);
        await syncOrganizationMembersToDatabase(userId, organizations);
        await deleteUnusedOrganizations();
    } catch (error) {
        console.error('Error syncing user to database:', error);
        throw error;
    }
}
