import type { UserWithOrganizations } from "types/UserWithOrganizations";

export type OrgUsers = {
    name: string;
    users: UserWithOrganizations[];
}