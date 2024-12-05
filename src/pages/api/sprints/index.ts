import type { APIRoute } from "astro";
import { db } from "@db/index";
import { sprintsTable, sprintMembersTable } from "@db/schema";
import { eq, inArray } from "drizzle-orm";
import type { Sprint } from "types/Sprint";

export const GET: APIRoute = async ({ request }) => {
    const currentUserId = request.headers.get("x-user-id");
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

export const POST: APIRoute = async ({ request }) => {
    debugger
    const currentUserId = request.headers.get("x-user-id");
    if (!currentUserId) {
        return new Response(
            JSON.stringify({
                message: "Error creating sprint: No user provided"
            }),
            { status: 401 }
        );
    }
    const body = await request.json();
    const sprint: Sprint = {
        ...body,
        createdBy: currentUserId
    };

    const newSprint = await db.insert(sprintsTable).values(sprint).returning();
    await db.insert(sprintMembersTable).values({
        sprintId: newSprint[0].id,
        userId: currentUserId
    });

    return new Response(
        JSON.stringify({
            sprint: sprint,
            message: "Sprint created successfully"
        }),
        { status: 200 }
    );
};
