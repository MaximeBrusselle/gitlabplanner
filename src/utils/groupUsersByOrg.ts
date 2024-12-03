import type { OrgUsers } from "types/OrgUsers";
import type { UserWithOrganizations } from "types/UserWithOrganizations";

export function groupUsersByOrg(users: UserWithOrganizations[]) {
	return users.reduce((acc: Record<string, OrgUsers>, user: UserWithOrganizations) => {
		user.organizations.forEach((org: any) => {
			if (!acc[org.id]) {
				acc[org.id] = {
					name: org.name,
					imageUrl: org.imageUrl,
					users: []
				};
			}
			acc[org.id].users.push(user);
		});
		return acc;
	}, {});
}
