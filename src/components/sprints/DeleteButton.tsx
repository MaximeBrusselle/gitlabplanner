import { useState } from 'react';

interface DeleteButtonProps {
    sprintId: number;
    authToken: string;
    onSuccess?: () => void;
}

export default function DeleteButton({ sprintId, authToken, onSuccess }: DeleteButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/sprints/${sprintId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                onSuccess?.() || (window.location.href = '/sprints');
            }
        } catch (error) {
            console.error('Failed to delete sprint:', error);
        } finally {
            setIsDeleting(false);
            setShowModal(false);
        }
    };

    return (
        <>
            <button 
                className="badge badge-error badge-lg" 
                onClick={() => setShowModal(true)}
                disabled={isDeleting}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Delete Sprint
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Are you sure you want to delete this sprint? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                className="btn btn-ghost"
                                onClick={() => setShowModal(false)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-error"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
