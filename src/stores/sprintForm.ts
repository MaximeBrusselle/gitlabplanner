import { atom } from 'nanostores';

export interface SprintFormData {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    members: string[];
    applications: string[];
    availableHours: number;
}

export const sprintFormStore = atom<SprintFormData>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    members: [],
    applications: [],
    availableHours: 0
});

export const updateSprintForm = (data: Partial<SprintFormData>) => {
    sprintFormStore.set({ ...sprintFormStore.get(), ...data });
}; 