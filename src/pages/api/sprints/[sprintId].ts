import type { APIRoute } from "astro";
import { db } from "@db/index";
import { sprintsTable, sprintMembersTable, usersTable, sprintApplicationsTable } from "@db/schema";
import { eq, and } from "drizzle-orm";
import type { Sprint } from "types/Sprint";

export const GET: APIRoute = async ({ locals, params }) => {
    const currentUserId = locals.auth().userId;
    if (!currentUserId) {
        return new Response(
            JSON.stringify({
                sprint: null,
                message: "Error fetching sprint: No user provided"
            }),
            { status: 401 }
        );
    }

    const sprintId = Number(params.sprintId);
    if (!sprintId) {
        return new Response(
            JSON.stringify({
                sprint: null,
                message: "Error fetching sprint: No sprint ID provided"
            }),
            { status: 400 }
        );
    }

    const sprint = await db
        .select()
        .from(sprintsTable)
        .where(eq(sprintsTable.id, sprintId))
        .limit(1);

    if (!sprint.length) {
        return new Response(
            JSON.stringify({
                sprint: null,
                message: "Sprint not found"
            }),
            { status: 404 }
        );
    }

    // Verify user has access to this sprint
    const sprintMember = await db
        .select()
        .from(sprintMembersTable)
        .where(and(
            eq(sprintMembersTable.sprintId, sprintId),
            eq(sprintMembersTable.userId, currentUserId))
        )
        .limit(1);

    if (!sprintMember.length) {
        return new Response(
            JSON.stringify({
                sprint: null,
                message: "Unauthorized to view this sprint"
            }),
            { status: 403 }
        );
    }

    // Get all members for this sprint
    const members = await db
        .select({
            id: usersTable.id,
            name: usersTable.name,
            email: usersTable.email,
            imageUrl: usersTable.imageUrl,
        })
        .from(sprintMembersTable)
        .innerJoin(usersTable, eq(sprintMembersTable.userId, usersTable.id))
        .where(eq(sprintMembersTable.sprintId, sprintId));

    return new Response(
        JSON.stringify({
            sprint: { ...sprint[0], members: members, role: sprintMember[0].role },
            message: "Sprint fetched successfully"
        }),
        { status: 200 }
    );
};

export const PATCH: APIRoute = async ({ locals, request, params }) => {
    const currentUserId = locals.auth().userId;
    if (!currentUserId) {
        return new Response(
            JSON.stringify({
                message: "Error updating sprint: No user provided"
            }),
            { status: 401 }
        );
    }
    const sprintId = Number(params.sprintId);
    if (!sprintId) {
        return new Response(
            JSON.stringify({
                message: "Error updating sprint: No sprint ID provided"
            }),
            { status: 400 }
        );
    }
    const body = await request.json();
    const sprint: Sprint = {
        ...body.sprint,
        createdBy: currentUserId
    };
    await db.update(sprintsTable).set(sprint).where(eq(sprintsTable.id, sprintId));
    return new Response(
        JSON.stringify({
            sprint: sprint,
            message: "Sprint updated successfully"
        }),
        { status: 200 }
    );
};

export const DELETE: APIRoute = async ({ locals, params }) => {
    const currentUserId = locals.auth().userId;
    if (!currentUserId) {
        return new Response(
            JSON.stringify({
                message: "Error deleting sprint: No user provided"
            }),
            { status: 401 }
        );
    }
    const sprintId = Number(params.sprintId);
    if (!sprintId) {
        return new Response(
            JSON.stringify({
                message: "Error deleting sprint: No sprint ID provided"
            }),
            { status: 400 }
        );
    }

    // Check if user has admin rights for this sprint
    const sprintMember = await db
        .select()
        .from(sprintMembersTable)
        .where(and(
            eq(sprintMembersTable.sprintId, sprintId),
            eq(sprintMembersTable.userId, currentUserId)
        ))
        .limit(1);

    if (!sprintMember.length || sprintMember[0].role !== "admin") {
        return new Response(
            JSON.stringify({
                message: "Error deleting sprint: User does not have admin rights"
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
            message: "Sprint deleted successfully"
        }),
        { status: 200 }
    );
};