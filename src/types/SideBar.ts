export type SideBarItem = {
	href: string;
	label: string;
};

export type RouteCollection = {
	[key: string]: SideBarRoute;
};

export type SideBarRoute = {
	title: string;
	items: SideBarItem[];
	icon: any;
	href?: string;
};
