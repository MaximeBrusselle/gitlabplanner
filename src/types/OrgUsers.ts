import type { UserWithOrganizations } from "types/UserWithOrganizations";

export type OrgUsers = {
    name: string;
    imageUrl: string;
    users: UserWithOrganizations[];
}