import type { User } from "types/User";

export type Sprint = {
    id?: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: "active" | "completed" | "cancelled" | "planned";
    createdBy: string;
}

export type SprintWithMembers = Sprint & {
    members: User[];
}
