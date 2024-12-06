import type { Organization } from "@myTypes/Organization";

export type UserWithOrganizations = {
    id: string;
    name: string;
    email: string;
    imageUrl: string | null;
    createdAt: string;
    lastSignIn: string;
	organizations: Organization[];
};
