import type { Organization } from "types/Organization";

export type UserWithOrganizations = {
    id: string;
    name: string;
    email: string;
    imageUrl: string | null;
    createdAt: string;
    lastSignIn: string;
	organizations: Organization[];
};
