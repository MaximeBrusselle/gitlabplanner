export type Organization = {
    id: string;
    name: string;
    imageUrl: string | null;
    role: string;
}

export type OrganizationRole = "admin" | "member";
