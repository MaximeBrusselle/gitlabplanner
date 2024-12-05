import { useStore } from "@nanostores/react";
import { sprintFormStore, updateSprintForm } from "../../stores/sprintForm";
import { useState, useEffect } from "react";

export const SprintFormStep2 = ({ userId }: { userId: string | null }) => {
	const formData = useStore(sprintFormStore);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const fetchUsers = async () => {
			const response = await fetch("/api/users", {
				headers: {
					"x-user-id": userId || "",
				},
			});
			const data = await response.json();
			setUsers(data.users);
		};
		fetchUsers();
	}, [userId]);

	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-bold mb-6">Select Team Members</h2>
			<div className="grid grid-cols-2 gap-4">
				{users.map((user: any) => (
					<label key={user.id} className="flex items-center space-x-3">
						<input
							type="checkbox"
							checked={formData.members.includes(user.id)}
							onChange={(e) => {
								const newMembers = e.target.checked ? [...formData.members, user.id] : formData.members.filter((id) => id !== user.id);
								updateSprintForm({ members: newMembers });
							}}
							className="form-checkbox h-5 w-5 text-indigo-600"
						/>
						<span className="text-gray-700 dark:text-gray-300">{user.name}</span>
					</label>
				))}
			</div>
		</div>
	);
};
