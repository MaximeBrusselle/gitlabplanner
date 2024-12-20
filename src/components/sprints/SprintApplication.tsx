import { type FC, useState } from "react";
import type { User } from "@myTypes/User";
import type { ApplicationDetails } from "@myTypes/Application";

interface SprintApplicationProps {
	application: ApplicationDetails;
}

const SprintApplication: FC<SprintApplicationProps> = ({ application }) => {
	const [hoveredMember, setHoveredMember] = useState<string | null>(null);

	return (
		<div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
			<h5 className="mb-3 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{application.name}</h5>
			<div className="mb-5 flex flex-col">
				<span className="text-base font-medium text-gray-500 dark:text-gray-400">
					Planned: {application.plannedHours || 0} / {application.availableHours || 0} hours
				</span>
                <span className="text-base font-medium text-gray-500 dark:text-gray-400">
					Spent: {application.spentHours || 0} hours
				</span>
			</div>
			<div className="flex -space-x-3">
				{application.members?.map((member: User) => (
					<div 
						key={member.id} 
						className="relative"
						onMouseEnter={() => setHoveredMember(member.id!)}
						onMouseLeave={() => setHoveredMember(null)}
					>
						<img
							className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-800 ring-2 ring-blue-500 dark:ring-blue-400 bg-gray-100 dark:bg-gray-600"
							src={member.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`}
							alt={`${member.name}'s avatar`}
						/>
						{hoveredMember === member.id && (
							<div
								className="absolute z-10 px-3 py-2 text-base font-medium text-white bg-gray-900 rounded-md shadow-sm dark:bg-gray-700 whitespace-nowrap"
								style={{
									bottom: "calc(100% + 8px)",
									left: "50%",
									transform: "translateX(-50%)"
								}}
							>
								{member.name}
								<div 
									className="absolute w-3 h-3 bg-gray-900 dark:bg-gray-700"
									style={{
										bottom: "-6px",
										left: "50%",
										transform: "translateX(-50%) rotate(45deg)"
									}}
								/>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default SprintApplication;
