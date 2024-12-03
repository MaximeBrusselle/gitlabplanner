import type { APIRoute } from "astro";
import { db } from "@db/index";
import { usersTable, organizationMembersTable, organizationsTable } from "@db/schema";
import { eq, inArray, and, notInArray } from "drizzle-orm";
import type { UserWithOrganizations } from "types/UserWithOrganizations";

export async function GET({ request }: { request: any }) {
	const currentUserId = request.headers.get("Authorization")?.split(" ")[1];
	if (!currentUserId) {
		return new Response(
			JSON.stringify({
				users: [],
				message: "Error fetching users: No user provided"
			}),
			{ status: 401 }
		);
	}
	const currentUser = await db.select().from(usersTable).where(eq(usersTable.id, currentUserId)).limit(1);

	const organizationsOfCurrentUser = await db
		.select({
			id: organizationsTable.id,
			name: organizationsTable.name
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
					name: organizationsTable.name
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

export const POST: APIRoute = async ({ request }) => {
	const body = await request.json();
	const existingUser = await db.select().from(usersTable).where(eq(usersTable.id, body.id)).limit(1);
	if (existingUser.length > 0) {
		await db
			.update(usersTable)
			.set({
				lastSignIn: new Date().toISOString(),
				name: body.name,
				email: body.email
			})
			.where(eq(usersTable.id, body.id));
		return new Response(JSON.stringify({ message: "User updated successfully" }));
	}
	await db.insert(usersTable).values({
		id: body.id,
		name: body.name,
		email: body.email,
		createdAt: new Date().toISOString(),
		lastSignIn: new Date().toISOString()
	});
	return new Response(JSON.stringify({ message: "User created successfully" }));
};
