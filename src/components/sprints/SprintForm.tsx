import { useState } from 'react';
import { SprintFormStep1 } from './SprintFormStep1';
import { SprintFormStep2 } from './SprintFormStep2';
import { useStore } from '@nanostores/react';
import { sprintFormStore } from '../../stores/sprintForm';

const steps = [
    { id: 1, component: SprintFormStep1, title: 'Basic Information' },
    { id: 2, component: SprintFormStep2, title: 'Team Members' },
];

export const SprintForm = ({ userId }: { userId: string | null }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const formData = useStore(sprintFormStore);
    const [error, setError] = useState('');

    const CurrentStepComponent = steps.find(step => step.id === currentStep)?.component;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        // Validate required fields before submission
        if (!formData.name || !formData.startDate || !formData.endDate) {
            setError('Please fill in all required fields');
            return;
        }
        console.log("🚀 ~ handleSubmit= ~ formData:", formData)
        

        try {
            const response = await fetch('/api/sprints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': userId || '',
                },
                body: JSON.stringify(formData),
            });
            
            if (response.ok) {
                window.location.href = '/sprints';
            } else {
                const data = await response.json();
                setError(data.message || 'Error creating sprint');
            }
        } catch (error) {
            console.error('Error creating sprint:', error);
            setError('Failed to create sprint');
        }
    };

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent form submission
        // Validate first step before proceeding
        if (currentStep === 1 && (!formData.name || !formData.startDate || !formData.endDate)) {
            setError('Please fill in all required fields');
            return;
        }
        setError('');
        setCurrentStep(currentStep + 1);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            
            <div className="flex items-center mb-8">
                {steps.map((step) => (
                    <div
                        key={step.id}
                        className={`flex-1 border-b-2 ${
                            step.id <= currentStep ? 'border-indigo-500' : 'border-gray-200'
                        }`}
                    >
                        <button
                            type="button"
                            onClick={() => setCurrentStep(step.id)}
                            className={`-mb-[2px] pb-4 ${
                                step.id === currentStep
                                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                                    : 'text-gray-500'
                            }`}
                        >
                            {step.title}
                        </button>
                    </div>
                ))}
            </div>

            {CurrentStepComponent && <CurrentStepComponent userId={userId} />}

            <div className="flex justify-between pt-6">
                {currentStep > 1 && (
                    <button
                        type="button"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="btn btn-outline"
                    >
                        Previous
                    </button>
                )}
                {currentStep < steps.length ? (
                    <button
                        type="button"
                        onClick={handleNext}
                        className="btn btn-primary"
                    >
                        Next
                    </button>
                ) : (
                    <button type="submit" className="btn btn-primary" style={{ display: currentStep === steps.length ? 'block' : 'none' }}>
                        Create Sprint
                    </button>
                )}
            </div>
        </form>
    );
};