import type { UserWithOrganizations } from "@myTypes/UserWithOrganizations";
import type { OrganizationRole } from "@myTypes/Organization";

export type OrgUsers = {
    name: string;
    imageUrl: string;
    users: UserWithOrganizations[];
    role: OrganizationRole;
}