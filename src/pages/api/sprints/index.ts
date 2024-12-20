import type { APIRoute } from "astro";
import { db } from "@db/index";
import { sprintsTable, sprintMembersTable, organizationMembersTable } from "@db/schema";
import { eq, inArray, and, sql } from "drizzle-orm";
import type { Sprint } from "@myTypes/Sprint";
import type { CustomLocals } from "@myTypes/CustomLocals";
import { syncDataToDatabase } from "@utils/clerk";
import { OrganizationRole } from "@myTypes/Organization";

export const GET: APIRoute = async ({ locals, request }) => {
	const currentUserId = locals.auth().userId;
	if (!currentUserId) {
		return new Response(
			JSON.stringify({
				sprints: [],
				message: "Error fetching sprints: No user provided",
			}),
			{ status: 401 }
		);
	}

	const url = new URL(request.url);
	const search = url.searchParams.get("search");
	const status = url.searchParams.get("status");
	const startDate = url.searchParams.get("startDate");
	const endDate = url.searchParams.get("endDate");

	const mySprints = await db.select().from(sprintMembersTable).where(eq(sprintMembersTable.userId, currentUserId));
	const sprints = await db
		.select()
		.from(sprintsTable)
		.where(
			and(
				inArray(
					sprintsTable.id,
					mySprints.map((sprint) => sprint.sprintId)
				),
				// Add search filter if search param exists
				search ? sql`${sprintsTable.name} LIKE ${`%${search}%`}` : undefined,
				// Add status filter if status param exists and is not 'All'
				status && status !== "All" ? eq(sprintsTable.status, status.toLowerCase() as "active" | "completed" | "cancelled" | "planned" | "draft") : undefined,
				// Add date range filters if they exist
				startDate ? sql`${sprintsTable.startDate} <= ${endDate || "9999-12-31"} AND ${sprintsTable.endDate} >= ${startDate}` : undefined,
				endDate ? sql`${sprintsTable.startDate} <= ${endDate} AND ${sprintsTable.endDate} >= ${startDate || "1970-01-01"}` : undefined
			)
		);
	return new Response(
		JSON.stringify({
			sprints: sprints,
			message: "Sprints fetched successfully",
		}),
		{ status: 200 }
	);
};

export const POST: APIRoute = async ({ locals, request }) => {
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
	const currentUserId = user.id;
	const orgMemberships = await customLocals.getOrganizations();

	//sync user to db
	//@ts-ignore
	await syncDataToDatabase(currentUserId, user, orgMemberships);

	const body = await request.json();
	const sprint: Sprint = {
		...body,
		createdBy: currentUserId,
		status: "draft",
	};

	const newSprint = await db.insert(sprintsTable).values(sprint).returning();
	const members = new Set<string>(body.members || [currentUserId]);

	//@ts-ignore
	const orgIds = orgMemberships.data.map((membership) => membership.organization.id);
	const membersOrganisations = await db
		.select()
		.from(organizationMembersTable)
		.where(and(inArray(organizationMembersTable.userId, Array.from(members)), inArray(organizationMembersTable.organizationId, orgIds)));

	await db.insert(sprintMembersTable).values(
		Array.from<string>(members).map((userId) => {
			const role = membersOrganisations.some((membership) => membership.userId === userId && membership.role === OrganizationRole.Admin) ? OrganizationRole.Admin : OrganizationRole.Member;
			return {
				sprintId: newSprint[0].id,
				userId: userId,
				role: role,
			};
		})
	);

	return new Response(
		JSON.stringify({
			sprint: sprint,
			message: "Sprint created successfully",
		}),
		{ status: 201 }
	);
};
