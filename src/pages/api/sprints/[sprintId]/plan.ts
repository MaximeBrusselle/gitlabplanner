import { db } from "@db/index";
import { applicationMembersTable, applicationsTable, sprintApplicationsTable, sprintMembersTable, sprintsTable, usersTable } from "@db/schema";
import type { APIRoute } from "astro";
import { and, eq } from "drizzle-orm";

type App = {
	applicationId: string;
	members: AppMember[];
	availableHours: number;
	plannedHours: number;
};

type AppMember = {
	percentage: number;
	availableHours: number;
	userId: string;
};

type Member = {
	availableHours: number;
	userId: string;
};

type PlanningFormData = {
	apps: App[];
	availableHours: number;
	buffer: number;
	members: Member[];
};

export const POST: APIRoute = async ({ locals, params, request }) => {
	debugger;

	const currentUserId = locals.auth().userId;
	if (!currentUserId) {
		return new Response(
			JSON.stringify({
				sprint: null,
				message: "Error Planning Sprint: No user provided",
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
					message: "Unauthorized to plan this sprint",
				}),
				{ status: 403 }
			);
		}

		// Update the sprint itself
		const data: PlanningFormData = await request.json();
		const totalPlannedHours = data.apps.reduce((acc: number, app: any) => acc + app.plannedHours, 0);
		const totalAvailableHours = Math.round(data.members.reduce((acc: number, member: any) => acc + member.availableHours, 0) * (1 - data.buffer / 100));
		await db.update(sprintsTable).set({
			plannedHours: totalPlannedHours,
			availableHours: totalAvailableHours,
			buffer: data.buffer,
			status: "planned",
		}).where(eq(sprintsTable.id, sprintId));

		// Update the sprint members
		const members = data.members
		for (const member of members) {
			await db.update(sprintMembersTable).set({
				availableHours: member.availableHours,
			}).where(and(eq(sprintMembersTable.sprintId, sprintId), eq(sprintMembersTable.userId, member.userId)));
		}

		// Update the applications
		const apps = data.apps.map((app: any) => ({
			applicationId: app.applicationId,
			plannedHours: app.plannedHours,
			members: app.members.map((member: any) => {
				const memberData = data.members.find((m: any) => m.userId === member.userId);
				return {
					...member,
					availableHours: memberData ? Math.round(memberData.availableHours * (member.percentage / 100) * (1 - data.buffer / 100)) : 0
				};
			}),
		})).map((app: any) => ({
			...app,
			availableHours: app.members.reduce((acc: number, member: any) => acc + member.availableHours, 0)
		}));

		for (const app of apps) {
			await db.update(sprintApplicationsTable).set({
				plannedHours: app.plannedHours,
				availableHours: app.availableHours,
			}).where(and(eq(sprintApplicationsTable.sprintId, sprintId), eq(sprintApplicationsTable.applicationId, app.applicationId)));
			for (const member of app.members) {
				await db.update(applicationMembersTable).set({
					availableHours: member.availableHours,
					percentage: member.percentage,
				}).where(and(eq(applicationMembersTable.applicationId, app.applicationId), eq(applicationMembersTable.userId, member.userId)));
			}
		}

		return new Response(
			JSON.stringify({
				sprint: sprint,
				message: "Sprint planned successfully",
			}),
			{ status: 200 }
		);
	} catch (error) {
		return new Response(
			JSON.stringify({
				message: "Error planning sprint",
			}),
			{ status: 500 }
		);
	}

	return new Response("Hello World", { status: 200 });
};
