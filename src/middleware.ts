import { clerkMiddleware, createRouteMatcher, clerkClient, type OrganizationMembership } from '@clerk/astro/server'
import type { OrganizationMembershipResource } from '@clerk/types'

// Extend Astro.locals type
declare module 'astro' {
    interface AstroGlobal {
        locals: {
            auth: () => {
                userId: string | null;
                getToken: () => Promise<string>;
            };
            getOrganizations: () => Promise<OrganizationMembership[]>;
        }
    }
}

// Protect all routes
const isProtectedRoute = createRouteMatcher(["/users", "/sprints", "/organizations", "/api/(.*)"])

export const onRequest = clerkMiddleware(async (auth: any, req: any, next: any) => {
    const { redirectToSignIn, userId } = auth()

    if (!userId && isProtectedRoute(req)) {
        return redirectToSignIn()
    }

    // Add getOrganizations to locals
    req.locals.getOrganizations = async () => {
        const client = clerkClient(req);
        return client.users.getOrganizationMembershipList({
            userId,
            limit: 100
        });
    };

    return next()
});
