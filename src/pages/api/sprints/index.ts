import type { APIRoute } from "astro";
import { db } from "db/index";
import { sprintsTable, sprintMembersTable, organizationMembersTable } from "db/schema";
import { eq, inArray } from "drizzle-orm";
import type { Sprint } from "types/Sprint";
import type { CustomLocals } from "types/CustomLocals";
import { syncDataToDatabase } from "utils/clerk";
import { OrganizationRole } from "types/Organization";

export const GET: APIRoute = async ({ locals }) => {
    const currentUserId = locals.auth().userId;
    if (!currentUserId) {
        return new Response(
            JSON.stringify({
                sprints: [],
                message: "Error fetching sprints: No user provided"
            }),
            { status: 401 }
        );
    }
    const mySprints = await db.select().from(sprintMembersTable).where(eq(sprintMembersTable.userId, currentUserId));
    const sprints = await db
        .select()
        .from(sprintsTable)
        .where(
            inArray(
                sprintsTable.id,
                mySprints.map((sprint) => sprint.sprintId)
            )
        );
    return new Response(
        JSON.stringify({
            sprints: sprints,
            message: "Sprints fetched successfully"
        }),
        { status: 200 }
    );
};

export const POST: APIRoute = async ({ locals, request }) => {
    debugger
    const customLocals = locals as CustomLocals;
    const user = await customLocals.currentUser();
    if (!user) {
        return new Response(
            JSON.stringify({
                message: "Error creating sprint: No user provided"
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
        createdBy: currentUserId
    };

    const newSprint = await db.insert(sprintsTable).values(sprint).returning();
    const members = new Set<string>(body.members || [currentUserId]);

    const membersOrganisations = await db.select().from(organizationMembersTable).where(inArray(organizationMembersTable.userId, Array.from(members)));

    // Check if user has admin role in any organization
    //@ts-ignore
    const hasAdminRole = membersOrganisations.some(membership => membership.role === OrganizationRole.Admin);

    await db.insert(sprintMembersTable).values(
        Array.from<string>(members).map((userId) => ({
            sprintId: newSprint[0].id,
            userId: userId,
            role: hasAdminRole || userId === currentUserId ? OrganizationRole.Admin : OrganizationRole.Member
        }))
    );

    return new Response(
        JSON.stringify({
            sprint: sprint,
            message: "Sprint created successfully"
        }),
        { status: 200 }
    );
};
