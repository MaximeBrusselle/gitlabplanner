export type Organization = {
    id: string;
    name: string;
    imageUrl: string | null;
    role: string;
}

export enum OrganizationRole {
    Admin = "admin",
    Member = "member"
}
