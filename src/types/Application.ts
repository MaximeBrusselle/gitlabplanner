import type { User } from "@myTypes/User";

export type Application = {
  id: number;
  name: string;
  description: string;
};

export type ApplicationDetails = Application & {
  members: User[];
  availableHours: number;
  plannedHours: number;
  spentHours: number;
};
