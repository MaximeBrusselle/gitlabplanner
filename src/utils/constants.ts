import type { RouteCollection } from "@myTypes/SideBar";

export const ROUTES: RouteCollection = {
	home: {
		title: "Welcome",
		items: [],
		icon: "/icons/home.svg",
		href: "/",
	},
	dashboard: {
		title: "Dashboard",
		items: [],
		icon: "/icons/dashboard.svg",
		href: "/dashboard",
	},
	organizations: {
		title: "Organizations",
		items: [
			{ href: "/organizations", label: "Overview" },
			{ href: "/organizations/users", label: "Users" },
		],
		icon: "/icons/organizations.svg",
	},
	sprints: {
		title: "Sprints",
		items: [
			{ href: "/sprints/", label: "Overview" },
			{ href: "/sprints/create", label: "Create" },
		],
		icon: "/icons/sprints.svg",
	},
	apps: {
		title: "Apps",
		items: [
			{ href: "/apps/", label: "Overview" },
			{ href: "/apps/create", label: "Create" },
		],
		icon: "/icons/apps.svg",
	},
	about: {
		title: "About",
		items: [],
		icon: "/icons/about.svg",
		href: "/about",
	},
};

export const EXTERNAL_ROUTES: RouteCollection = {
	github: {
		title: "GitHub Repository",
		href: "https://github.com/MaximeBrusselle/gitlabplanner",
		items: [],
		icon: "/icons/github.svg",
	},
	docs: {
		title: "Docs",
		href: "/docs",
		items: [],
		icon: "/icons/docs.svg",
	},
	support: {
		title: "Support",
		href: "https://github.com/MaximeBrusselle/gitlabplanner/issues",
		items: [],
		icon: "/icons/support.svg",
	},
};
