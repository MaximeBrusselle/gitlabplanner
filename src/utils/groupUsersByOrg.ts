import type { Organization, OrganizationRole } from "@myTypes/Organization";
import type { OrgUsers } from "@myTypes/OrgUsers";
import type { UserWithOrganizations } from "@myTypes/UserWithOrganizations";

export function groupUsersByOrg(users: UserWithOrganizations[]): Record<string, OrgUsers> {
	return users.reduce((acc: Record<string, OrgUsers>, user: UserWithOrganizations) => {
		user.organizations.forEach((org: Organization) => {
			if (!acc[org.id]) {
				acc[org.id] = {
					name: org.name,
					imageUrl: org.imageUrl ?? '',
					role: org.role as OrganizationRole,
					users: []
				};
			}
			acc[org.id].users.push(user);
		});
		return acc;
	}, {});
}
