import { db } from "@db/index";
import { usersTable, organizationsTable, organizationMembersTable } from "@db/schema";
import { eq, and, isNull, inArray } from "drizzle-orm";
import type { User, Organization } from "@clerk/backend";

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

async function syncOrganizationsToDatabase(organizations: { data: Organization[] }) {
    for (const org of organizations.data) {
        const existingOrg = await db.select()
            .from(organizationsTable)
            .where(eq(organizationsTable.id, org.id))
            .limit(1);

        if (existingOrg.length === 0) {
            await db.insert(organizationsTable).values({
                id: org.id,
                name: org.name,
            });
            return;
        }
        await db.update(organizationsTable)
            .set({ name: org.name })
            .where(eq(organizationsTable.id, org.id));
    }
}

async function syncOrganizationMembersToDatabase(userId: string, organizations: { data: Organization[] }) {
    // Get all current organization memberships for the user
    const existingMemberships = await db.select()
        .from(organizationMembersTable)
        .where(eq(organizationMembersTable.userId, userId));

    // Create a set of organization IDs from the current data
    const currentOrgIds = new Set(organizations.data.map(org => org.id));

    // Remove memberships that no longer exist
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

    // Add new memberships
    for (const org of organizations.data) {
        const existingMember = await db.select()
            .from(organizationMembersTable)
            .where(and(eq(organizationMembersTable.organizationId, org.id), eq(organizationMembersTable.userId, userId)))
            .limit(1);

        if (existingMember.length === 0) {
            await db.insert(organizationMembersTable).values({
                organizationId: org.id,
                userId: userId,
                createdAt: new Date().toISOString(),
            });
        }
    }
}

async function deleteUnusedOrganizations() {
    // Get all orgs that have no members
    const orgsWithoutMembers = await db
        .select({ id: organizationsTable.id })
        .from(organizationsTable)
        .leftJoin(
            organizationMembersTable,
            eq(organizationsTable.id, organizationMembersTable.organizationId)
        )
        .where(isNull(organizationMembersTable.organizationId));

    // Delete orgs that have no members
    if (orgsWithoutMembers.length > 0) {
        const orgIdsToDelete = orgsWithoutMembers.map(org => org.id);
        await db.delete(organizationsTable)
            .where(inArray(organizationsTable.id, orgIdsToDelete));
    }
}

export async function syncDataToDatabase(
    userId: string,
    user: User,
    organizations: { data: Organization[] }
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
