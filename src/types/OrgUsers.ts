import type { UserWithOrganizations } from "types/UserWithOrganizations";
import type { OrganizationRole } from "./Organization";

export type OrgUsers = {
    name: string;
    imageUrl: string;
    users: UserWithOrganizations[];
    role: OrganizationRole;
}