import type { APIRoute } from 'astro';
import { db } from '@db/index';
import { usersTable } from '@db/schema';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async ({ request }) => {
    // debugger;
    const allUsers = await db.select().from(usersTable);
    
    return new Response(
        JSON.stringify({
            users: allUsers,
            message: "got users",
        }),
        { status: 200 },
    );
}; 

export const POST: APIRoute = async ({ request }) => {
    const body = await request.json();
    const existingUser = await db.select().from(usersTable).where(eq(usersTable.id, body.id)).limit(1);
    if (existingUser.length > 0) {
        await db.update(usersTable)
            .set({
                lastSignIn: new Date().toISOString(),
                name: body.name,
                email: body.email
            })
            .where(eq(usersTable.id, body.id));
        return new Response(JSON.stringify({ message: 'User updated successfully' }));
    }
    await db.insert(usersTable).values({
        id: body.id,
        name: body.name,
        email: body.email,
        createdAt: new Date().toISOString(),
        lastSignIn: new Date().toISOString()
    });
    return new Response(JSON.stringify({ message: 'User created successfully' }));
}; 
