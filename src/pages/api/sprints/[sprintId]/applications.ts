import type { APIRoute } from "astro";
import { db } from "@db/index";
import { sprintsTable, sprintMembersTable, applicationsTable, sprintApplicationsTable, applicationMembersTable } from "@db/schema";
import { eq, and, inArray } from "drizzle-orm";
import type { CustomLocals } from "@myTypes/CustomLocals";

export const POST: APIRoute = async ({ locals, params, request }) => {
    debugger
	const customLocals = locals as CustomLocals;
	const user = await customLocals.currentUser();
	if (!user) {
		return new Response(
			JSON.stringify({
				message: "Error creating application: No user provided",
			}),
			{ status: 401 }
		);
	}

	const sprintId = Number(params.sprintId);
	if (!sprintId) {
		return new Response(
			JSON.stringify({
				message: "Error creating application: No sprint ID provided",
			}),
			{ status: 400 }
		);
	}

	// Check if user is part of sprint
	const sprintMember = await db
		.select()
		.from(sprintMembersTable)
		.where(and(eq(sprintMembersTable.sprintId, sprintId), eq(sprintMembersTable.userId, user.id)))
		.limit(1);

	if (!sprintMember.length) {
		return new Response(
			JSON.stringify({
				message: "Error creating application: User is not a member of this sprint",
			}),
			{ status: 403 }
		);
	}

	try {
		const body = await request.json();
		const members = new Set<string>(body.members || []);

		// Create the application
		const [application] = await db
			.insert(applicationsTable)
			.values({
				name: body.name,
				description: body.description,
			})
			.returning();

		// Link application to sprint
		await db.insert(sprintApplicationsTable).values({
			sprintId,
			applicationId: application.id,
			availableHours: 0,
			spentHours: 0,
			plannedHours: 0,
		});

		// Add application members - only add members that are part of the sprint
		if (members.size > 0) {
			// First verify these members are part of the sprint
			const sprintMembers = await db
				.select()
				.from(sprintMembersTable)
				.where(and(
					eq(sprintMembersTable.sprintId, sprintId),
					inArray(sprintMembersTable.userId, Array.from(members))
				));

			const validMemberIds = sprintMembers.map(member => member.userId);

			if (validMemberIds.length > 0) {
				await db.insert(applicationMembersTable).values(
					validMemberIds.map((memberId) => ({
						applicationId: application.id,
						userId: memberId,
						availableHours: 0,
						spentHours: 0,
						plannedHours: 0,
					}))
				);
			}
		}

		return new Response(
			JSON.stringify({
				message: "Application created successfully",
				application,
			}),
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating application:", error);
		return new Response(
			JSON.stringify({
				message: "Error creating application: Invalid request data",
			}),
			{ status: 400 }
		);
	}
};
