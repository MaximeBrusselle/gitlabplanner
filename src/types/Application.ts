import type { User } from "@myTypes/User";

export type Application = {
  id: number;
  name: string;
  description: string;
};

export type ApplicationMember = User & {
  percentage: number;
};

export type ApplicationDetails = Application & {
  members: ApplicationMember[];
  availableHours: number;
  plannedHours: number;
  spentHours: number;
};
