import type { OrgUsers } from "@myTypes/OrgUsers";
import { Table } from "flowbite-react";

interface UserOverviewProps {
	orgData: OrgUsers;
}

export default function UserOverview({ orgData }: UserOverviewProps) {

	return (
		<Table striped>
			<Table.Head>
				<Table.HeadCell>Image</Table.HeadCell>
				<Table.HeadCell>Email</Table.HeadCell>
				<Table.HeadCell className="lg:table-cell hidden">Name</Table.HeadCell>
				<Table.HeadCell className="lg:table-cell hidden">Created At</Table.HeadCell>
				<Table.HeadCell className="lg:table-cell hidden">Last Sign In</Table.HeadCell>
			</Table.Head>
			<Table.Body className="divide-y">
				{orgData.users.map((user: any) => (
					<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={user.id}>
						<Table.Cell>
							<img src={user.imageUrl} alt={user.name} className="w-12 h-12 rounded-lg object-cover" />
						</Table.Cell>
						<Table.Cell className="font-medium text-gray-900 dark:text-white">{user.email}</Table.Cell>
						<Table.Cell className="font-semibold lg:table-cell hidden">{user.name}</Table.Cell>
						<Table.Cell className="text-gray-500 dark:text-gray-400 lg:table-cell hidden">
							{new Date(user.createdAt).toLocaleString()}
						</Table.Cell>
						<Table.Cell className="text-gray-500 dark:text-gray-400 lg:table-cell hidden">
							{new Date(user.lastSignIn).toLocaleString()}
						</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table>
	);
}
