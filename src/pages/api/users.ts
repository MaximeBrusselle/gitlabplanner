import type { APIRoute } from "astro";
import { db } from "@db/index";
import { usersTable, organizationMembersTable } from "@db/schema";
import { eq, inArray, and, notInArray } from "drizzle-orm";

export async function GET({ request }: { request: any }) {
	const currentUserId = request.headers.get("Authorization")?.split(" ")[1];
	if (!currentUserId) {
		return new Response(
			JSON.stringify({
				users: [],
				message: "got users"
			}),
			{ status: 401 }
		);
	}
	const currentUser = await db.select().from(usersTable).where(eq(usersTable.id, currentUserId));
	let allUsers = [...currentUser];
	const organizationsOfCurrentUser = await db.select().from(organizationMembersTable).where(eq(organizationMembersTable.userId, currentUserId));
	const orgIds = organizationsOfCurrentUser.map((org) => org.organizationId);
	const usersInSameOrgs = await db
		.select()
		.from(organizationMembersTable)
		.where(and(inArray(organizationMembersTable.organizationId, orgIds), notInArray(organizationMembersTable.userId, [currentUserId])));
	const otherUserIds = usersInSameOrgs.map((user) => user.userId);
	const otherUsers = await db.select().from(usersTable).where(inArray(usersTable.id, otherUserIds));
	allUsers.push(...otherUsers);

	return new Response(
		JSON.stringify({
			users: allUsers,
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
