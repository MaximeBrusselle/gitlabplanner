import type { User } from "@myTypes/User";
import type { ApplicationDetails } from "@myTypes/Application";

export type Sprint = {
    id?: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: "active" | "completed" | "cancelled" | "planned" | "readyToPlan" | "draft";
    createdBy: string;
}

export type SprintDetails = Sprint & {
    applications: ApplicationDetails[];
    members: User[];
    availableHours: number;
    plannedHours: number;
    spentHours: number;
}

export type SprintWithMembers = Sprint & {
    members: User[];
}
