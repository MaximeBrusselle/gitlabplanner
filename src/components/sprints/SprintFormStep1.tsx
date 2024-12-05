import { useStore } from '@nanostores/react';
import { sprintFormStore, updateSprintForm } from '../../stores/sprintForm';

export const SprintFormStep1 = () => {
    const formData = useStore(sprintFormStore);

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sprint Name
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateSprintForm({ name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description (Optional)
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => updateSprintForm({ description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows={3}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Start Date
                    </label>
                    <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => updateSprintForm({ startDate: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        End Date
                    </label>
                    <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => updateSprintForm({ endDate: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
            </div>
        </div>
    );
}; 