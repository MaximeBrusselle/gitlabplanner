import type { APIRoute } from "astro";
import { db } from "@db/index";
import { sprintsTable, sprintMembersTable, usersTable, sprintApplicationsTable, applicationsTable, organizationMembersTable, applicationMembersTable } from "@db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { OrganizationRole } from "@myTypes/Organization";
import type { CustomLocals } from "@myTypes/CustomLocals";

export const GET: APIRoute = async ({ locals, params }) => {
	const currentUserId = locals.auth().userId;
	if (!currentUserId) {
		return new Response(
			JSON.stringify({
				sprint: null,
				message: "Error fetching sprint: No user provided",
			}),
			{ status: 401 }
		);
	}

	const sprintId = Number(params.sprintId);
	if (!sprintId) {
		return new Response(
			JSON.stringify({
				sprint: null,
				message: "Error fetching sprint: No sprint ID provided",
			}),
			{ status: 400 }
		);
	}

	try {
		const [sprint, sprintMember] = await Promise.all([
			db.select().from(sprintsTable).where(eq(sprintsTable.id, sprintId)).limit(1),
			db
				.select()
				.from(sprintMembersTable)
				.where(and(eq(sprintMembersTable.sprintId, sprintId), eq(sprintMembersTable.userId, currentUserId)))
				.limit(1),
		]);

		if (!sprint.length) {
			return new Response(
				JSON.stringify({
					sprint: null,
					message: "Sprint not found",
				}),
				{ status: 404 }
			);
		}

		if (!sprintMember.length) {
			return new Response(
				JSON.stringify({
					sprint: null,
					message: "Unauthorized to view this sprint",
				}),
				{ status: 403 }
			);
		}

		const [members, sprintApplications] = await Promise.all([
			db
				.select({
					id: usersTable.id,
					name: usersTable.name,
					email: usersTable.email,
					imageUrl: usersTable.imageUrl,
				})
				.from(sprintMembersTable)
				.innerJoin(usersTable, eq(sprintMembersTable.userId, usersTable.id))
				.where(eq(sprintMembersTable.sprintId, sprintId)),
			db
				.select()
				.from(sprintApplicationsTable)
				.innerJoin(applicationsTable, eq(sprintApplicationsTable.applicationId, applicationsTable.id))
				.where(eq(sprintApplicationsTable.sprintId, sprintId)),
		]);

		// Get application members for each application
		const applications = await Promise.all(
			sprintApplications.map(async (app) => {
				const applicationMembers = await db
					.select({
						id: usersTable.id,
						name: usersTable.name,
						email: usersTable.email,
						imageUrl: usersTable.imageUrl,
						percentage: applicationMembersTable.percentage,
					})
					.from(applicationMembersTable)
					.innerJoin(usersTable, eq(applicationMembersTable.userId, usersTable.id))
					.where(eq(applicationMembersTable.applicationId, app.applications.id));

				return {
					...app.applications,
					availableHours: app.sprint_applications.availableHours,
					plannedHours: app.sprint_applications.plannedHours,
					spentHours: app.sprint_applications.spentHours,
					members: applicationMembers
				};
			})
		);

		const dataToReturn = {
			...sprint[0],
			members,
			role: sprintMember[0].role,
			applications,
		};

		return new Response(
			JSON.stringify({
				sprint: dataToReturn,
				message: "Sprint fetched successfully",
			}),
			{ status: 200 }
		);
	} catch (error) {
		return new Response(
			JSON.stringify({
				sprint: null,
				message: "Error fetching sprint data",
			}),
			{ status: 500 }
		);
	}
};

export const PATCH: APIRoute = async ({ locals, request, params }) => {
	const customLocals = locals as CustomLocals;
	const user = await customLocals.currentUser();
	if (!user) {
		return new Response(
			JSON.stringify({
				message: "Error creating sprint: No user provided",
			}),
			{ status: 401 }
		);
	}

	const sprintId = Number(params.sprintId);
	if (!sprintId) {
		return new Response(
			JSON.stringify({
				message: "Error updating sprint: No sprint ID provided",
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
				message: "Error updating sprint: User is not a member of this sprint",
			}),
			{ status: 403 }
		);
	}

	try {
		const body = await request.json();
		const orgMemberships = await customLocals.getOrganizations();
		const members = new Set<string>(body.members || [user.id]);

		await Promise.all([
			// Update sprint details
			db
				.update(sprintsTable)
				.set({
					name: body.name,
					description: body.description,
					startDate: body.startDate,
					endDate: body.endDate,
				})
				.where(eq(sprintsTable.id, sprintId)),

			// Delete existing members
			db.delete(sprintMembersTable).where(eq(sprintMembersTable.sprintId, sprintId)),
		]);

		//@ts-ignore
		const orgIds = orgMemberships.data.map((membership) => membership.organization.id);
		const membersOrganisations = await db
			.select()
			.from(organizationMembersTable)
			.where(and(inArray(organizationMembersTable.userId, Array.from(members)), inArray(organizationMembersTable.organizationId, orgIds)));

		// Add new members
		await db.insert(sprintMembersTable).values(
			Array.from(members).map((userId) => ({
				sprintId,
				userId,
				role: membersOrganisations.some((membership) => membership.userId === userId && membership.role === OrganizationRole.Admin) ? OrganizationRole.Admin : OrganizationRole.Member,
			}))
		);

		return new Response(
			JSON.stringify({
				message: "Sprint updated successfully",
			}),
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error updating sprint:", error);
		return new Response(
			JSON.stringify({
				message: "Error updating sprint: Invalid request data",
			}),
			{ status: 400 }
		);
	}
};

export const DELETE: APIRoute = async ({ locals, params }) => {
	const currentUserId = locals.auth().userId;
	if (!currentUserId) {
		return new Response(
			JSON.stringify({
				message: "Error deleting sprint: No user provided",
			}),
			{ status: 401 }
		);
	}
	const sprintId = Number(params.sprintId);
	if (!sprintId) {
		return new Response(
			JSON.stringify({
				message: "Error deleting sprint: No sprint ID provided",
			}),
			{ status: 400 }
		);
	}

	// Check if user has admin rights for this sprint
	const sprintMember = await db
		.select()
		.from(sprintMembersTable)
		.where(and(eq(sprintMembersTable.sprintId, sprintId), eq(sprintMembersTable.userId, currentUserId)))
		.limit(1);

	if (!sprintMember.length || sprintMember[0].role !== "admin") {
		return new Response(
			JSON.stringify({
				message: "Error deleting sprint: User does not have admin rights",
			}),
			{ status: 403 }
		);
	}

	// Delete all sprint members first
	await db.delete(sprintMembersTable).where(eq(sprintMembersTable.sprintId, sprintId));

	// Delete all sprint applications
	await db.delete(sprintApplicationsTable).where(eq(sprintApplicationsTable.sprintId, sprintId));

	// Finally delete the sprint itself
	await db.delete(sprintsTable).where(eq(sprintsTable.id, sprintId));

	return new Response(
		JSON.stringify({
			message: "Sprint deleted successfully",
		}),
		{ status: 200 }
	);
};
