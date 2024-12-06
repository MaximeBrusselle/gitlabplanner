import Card from "@components/Card.astro";
import { useState, useEffect } from "react";
import type { OrgUsers } from "types/OrgUsers";

interface UserSelectorProps {
	groupedUsers: Record<string, OrgUsers>;
	currentUserId: string;
}

export default function UserSelector({ groupedUsers, currentUserId }: UserSelectorProps) {
	const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set([currentUserId]));

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
		console.log("🚀 ~ handleUserSelection ~ newSelected:", newSelected);
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
				<div key={orgUsers.name} className="card bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 w-full">
					<div className="card-body">
						<h3 className="card-title text-xl font-bold flex items-center gap-2">
							<div className="avatar">
								<div className="mask mask-squircle w-6 h-6">
									<img src={orgUsers.imageUrl} alt={orgUsers.name} />
								</div>
							</div>
							{orgUsers.name}
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{orgUsers.users.map((user) => (
								<label key={user.id} className="flex items-center p-3 border rounded-xl hover:bg-base-200 transition-colors cursor-pointer">
									<input
										type="checkbox"
										name="members"
										value={user.id}
										className="checkbox checkbox-primary mr-3"
										checked={selectedUsers.has(user.id)}
										onChange={(e) => handleUserSelection(user.id, e.target.checked)}
										disabled={user.id === currentUserId}
									/>
									<div className="flex items-center gap-3">
										<div className="avatar">
											<div className="mask mask-squircle w-10 h-10 ring ring-primary ring-offset-base-100 ring-offset-2">
												<img src={user.imageUrl ?? ""} alt={user.name} />
											</div>
										</div>
										<div>
											<div className="font-semibold">{user.name}</div>
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
