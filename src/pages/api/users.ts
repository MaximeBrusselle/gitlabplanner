import type { APIRoute } from "astro";
import { db } from "@db/index";
import { usersTable, organizationMembersTable, organizationsTable } from "@db/schema";
import { eq, inArray, and, notInArray } from "drizzle-orm";
import type { UserWithOrganizations } from "types/UserWithOrganizations";
import type { CustomLocals } from "types/CustomLocals";
import { syncDataToDatabase } from "utils/clerk";

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

	const currentUser = await db.select().from(usersTable).where(eq(usersTable.id, user.id)).limit(1);

	const organizationsOfCurrentUser = await db
		.select({
			id: organizationsTable.id,
			name: organizationsTable.name,
			imageUrl: organizationsTable.imageUrl
		})
		.from(organizationMembersTable)
		.innerJoin(organizationsTable, eq(organizationMembersTable.organizationId, organizationsTable.id))
		.where(eq(organizationMembersTable.userId, currentUserId));

	const currentUserComplete = currentUser.map((user) => ({
		...user,
		organizations: organizationsOfCurrentUser
	})) as UserWithOrganizations[];

	const usersInSameOrgs = await db
		.select()
		.from(organizationMembersTable)
		.where(
			and(
				inArray(
					organizationMembersTable.organizationId,
					organizationsOfCurrentUser.map((org) => org.id)
				),
				notInArray(organizationMembersTable.userId, [currentUserId])
			)
		)
		.then((res) => res.map((user) => user.userId));

	const otherUsers = await db.select().from(usersTable).where(inArray(usersTable.id, usersInSameOrgs));

	const otherUsersWithOrgs = await Promise.all(
		otherUsers.map(async (user) => {
			const userOrgs = await db
				.select({
					id: organizationsTable.id,
					name: organizationsTable.name,
					imageUrl: organizationsTable.imageUrl
				})
				.from(organizationMembersTable)
				.innerJoin(organizationsTable, eq(organizationMembersTable.organizationId, organizationsTable.id))
				.where(eq(organizationMembersTable.userId, user.id));

			return {
				...user,
				organizations: userOrgs
			};
		})
	);

	return new Response(
		JSON.stringify({
			users: [...currentUserComplete, ...otherUsersWithOrgs],
			message: "got users"
		}),
		{ status: 200 }
	);
}
