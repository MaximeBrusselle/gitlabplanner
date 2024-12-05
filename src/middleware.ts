import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/astro/server'
import { syncDataToDatabase } from './utils/clerk';

// Protect all routes that start with /api/users
const isProtectedRoute = createRouteMatcher(["/users", "/sprints", "/organizations"])

export const onRequest = clerkMiddleware(async (auth: any, req: any, next: any) => {
    // debugger
    const { redirectToSignIn, userId } = auth()

    if (!userId && isProtectedRoute(req)) {
        return redirectToSignIn()
    }

    if (userId) {
        try {
            const client = clerkClient(req);
            const user = await client.users.getUser(userId);
            const params = {
                userId,
                limit: 100,
            }
            const organizations = await client.users.getOrganizationMembershipList(params)

            if (user) {
                await syncDataToDatabase(userId, user, organizations);
            }
        } catch (error) {
            console.error('Error in middleware:', error);
        }
    }

    return next()
});
