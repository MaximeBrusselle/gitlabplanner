export type Sprint = {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: "active" | "completed" | "cancelled" | "planned";
    createdBy: string;
}
