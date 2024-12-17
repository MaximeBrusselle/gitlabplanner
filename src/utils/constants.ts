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

export const STATUS_COLORS: Record<string, string> = {
	active: "text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-300",
	completed: "text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-300",
	cancelled: "text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-300",
	planned: "text-yellow-800 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300",
	draft: "text-purple-800 bg-purple-100 dark:bg-purple-900 dark:text-purple-300"
};
