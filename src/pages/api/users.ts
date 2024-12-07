import type { APIRoute } from "astro";
import { db } from "@db/index";
import { usersTable, organizationMembersTable, organizationsTable } from "@db/schema";
import { eq, inArray, and, notInArray } from "drizzle-orm";
import type { UserWithOrganizations } from "@myTypes/UserWithOrganizations";
import type { CustomLocals } from "@myTypes/CustomLocals";
import { syncDataToDatabase } from "@utils/clerk";

export const GET: APIRoute = async ({ locals, request }) => {
	const customLocals = locals as CustomLocals;
	const user = await customLocals.currentUser();
	if (!user) {
		return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
	}
	const currentUserId = user.id;
	const orgMemberships = await customLocals.getOrganizations();

	//sync user to db
	//@ts-ignore
	await syncDataToDatabase(currentUserId, user, orgMemberships);
	//@ts-ignore
	const orgIds = orgMemberships.data.map((org) => org.organization.id);
	const usersWithOrgs = await db
		.select({
			id: usersTable.id,
			name: usersTable.name,
			email: usersTable.email,
			imageUrl: usersTable.imageUrl,
			createdAt: usersTable.createdAt,
			lastSignIn: usersTable.lastSignIn,
			organizations: organizationsTable
		})
		.from(usersTable)
		.innerJoin(organizationMembersTable, eq(organizationMembersTable.userId, usersTable.id))
		.innerJoin(organizationsTable, eq(organizationsTable.id, organizationMembersTable.organizationId))
		.where(inArray(organizationMembersTable.organizationId, orgIds))
		.then((results) => {
			// Group by user and collect organizations
			const userMap = results.reduce(
				(acc, row) => {
					if (!acc[row.id]) {
						const { organizations, ...user } = row;
						acc[row.id] = { ...user, organizations: [organizations] };
					} else {
						acc[row.id].organizations.push(row.organizations);
					}
					return acc;
				},
				{} as Record<string, any>
			);

			// Convert to array and sort by name
			return Object.values(userMap).sort((a, b) => 
				a.name.localeCompare(b.name)
			);
		});

	return new Response(
		JSON.stringify({
			users: usersWithOrgs,
			message: "got users"
		}),
		{ status: 200 }
	);
};
