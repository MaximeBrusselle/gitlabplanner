import { useEffect, useState } from "react";

export default function UserOverview() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('/api/users')
            .then(response => response.json())
            .then(data => setUsers(data));
    }, []);

	return (
		<div className="bg-white rounded-lg shadow overflow-hidden">
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50">
					<tr>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Sign In</th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{users.map((user: any) => (
						<tr>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.data.id}</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.data.email}</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.data.name}</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.data.createdAt).toLocaleString()}</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.data.lastSignIn).toLocaleString()}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
