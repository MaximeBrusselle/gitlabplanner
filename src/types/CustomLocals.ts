import type { OrganizationMembership } from "@clerk/astro/server";

export type CustomLocals = App.Locals & {
	getOrganizations: () => Promise<OrganizationMembership[]>;
}
