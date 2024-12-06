import { db } from "@db/index";
import { usersTable, organizationsTable, organizationMembersTable } from "@db/schema";
import { eq, and, isNull, inArray } from "drizzle-orm";
import type { User, Organization, PaginatedResponseJSON } from "@clerk/backend";
import type { OrganizationMembership } from "@clerk/astro/server";
import type { OrganizationRole } from "types/Organization";

export async function syncDataToDatabase(
    userId: string, 
    user: User,
    organizations: { data: OrganizationMembership[] }
) {
    try {
        // Sync user data
        const existingUser = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
        const userData = {
            name: `${user.firstName} ${user.lastName}`.trim() || user.username || 'Anonymous',
            email: user.emailAddresses[0].emailAddress,
            imageUrl: user.imageUrl,
            lastSignIn: new Date().toISOString()
        };

        if (existingUser.length === 0) {
            await db.insert(usersTable).values({
                id: userId,
                createdAt: new Date().toISOString(),
                ...userData
            });
        } else {
            await db.update(usersTable)
                .set(userData)
                .where(eq(usersTable.id, userId));
        }

        // Sync organizations and memberships in parallel
        await Promise.all([
            // Sync organizations
            ...organizations.data.map(async (org) => {
                await db.insert(organizationsTable)
                    .values({
                        id: org.organization.id,
                        name: org.organization.name,
                        imageUrl: org.organization.imageUrl
                    })
                    .onConflictDoUpdate({
                        target: organizationsTable.id,
                        set: {
                            name: org.organization.name,
                            imageUrl: org.organization.imageUrl
                        }
                    });
            }),

            // Sync memberships
            (async () => {
                const currentOrgIds = organizations.data.map(org => org.organization.id);
                
                // Delete old memberships
                await db.delete(organizationMembersTable)
                    .where(
                        and(
                            eq(organizationMembersTable.userId, userId),
                            isNull(inArray(organizationMembersTable.organizationId, currentOrgIds))
                        )
                    );

                // Insert new memberships
                await Promise.all(
                    organizations.data.map(org => 
                        db.insert(organizationMembersTable)
                            .values({
                                organizationId: org.organization.id,
                                userId: userId,
                                createdAt: new Date().toISOString(),
                                role: org.role.substring(4) as OrganizationRole
                            })
                            .onConflictDoNothing()
                    )
                );
            })()
        ]);

        // Clean up unused organizations
        const orgsWithoutMembers = await db
            .select({ id: organizationsTable.id })
            .from(organizationsTable)
            .leftJoin(
                organizationMembersTable,
                eq(organizationsTable.id, organizationMembersTable.organizationId)
            )
            .where(isNull(organizationMembersTable.organizationId));

        if (orgsWithoutMembers.length > 0) {
            await db.delete(organizationsTable)
                .where(inArray(organizationsTable.id, orgsWithoutMembers.map(org => org.id)));
        }

    } catch (error) {
        console.error('Error syncing data to database:', error);
        throw error;
    }
}
