import { useState, useEffect } from "react";
import type { OrgUsers } from "@myTypes/OrgUsers";

interface UserSelectorProps {
	groupedUsers: Record<string, OrgUsers>;
	currentUserId: string;
	addedUsers: string[];
}

export default function UserSelector({ groupedUsers, currentUserId, addedUsers }: UserSelectorProps) {
	const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set(addedUsers));

	useEffect(() => {
		// Ensure current user is always selected
		setSelectedUsers((prev) => new Set([...prev, currentUserId]));
	}, [currentUserId]);

	const handleUserSelection = (userId: string, checked: boolean) => {
		// Don't allow deselecting current user
		if (userId === currentUserId) return;

		const newSelected = new Set(selectedUsers);
		if (checked) {
			newSelected.add(userId);
		} else {
			newSelected.delete(userId);
		}
		setSelectedUsers(newSelected);
	};

	return (
		<div className="space-y-8">
			{/* Add hidden inputs for all selected users */}
			{Array.from(selectedUsers).map(userId => (
				<input 
					key={userId}
					type="hidden"
					name="members"
					value={userId}
				/>
			))}

			{Object.entries(groupedUsers).map(([_, orgUsers]) => (
				<div key={orgUsers.name} className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
					<div className="space-y-4">
						<h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
							<div className="relative w-6 h-6">
								<img className="rounded-lg" src={orgUsers.imageUrl} alt={orgUsers.name} />
							</div>
							{orgUsers.name}
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{orgUsers.users.map((user) => (
								<label key={user.id} className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 cursor-pointer">
									<input
										type="checkbox"
										name="members"
										value={user.id}
										className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-3 disabled:opacity-50 disabled:cursor-not-allowed"
										checked={selectedUsers.has(user.id)}
										onChange={(e) => handleUserSelection(user.id, e.target.checked)}
										disabled={user.id === currentUserId}
									/>
									<div className="flex items-center gap-3">
										<div className="relative">
											<img 
												className="w-10 h-10 rounded-lg p-0.5" 
												src={user.imageUrl ?? ""} 
												alt={user.name}
											/>
										</div>
										<div>
											<div className="font-semibold text-gray-900 dark:text-white">{user.name}</div>
										</div>
									</div>
								</label>
							))}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
