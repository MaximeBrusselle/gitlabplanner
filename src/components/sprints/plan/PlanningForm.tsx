import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@myTypes/User";
import type { Sprint } from "@myTypes/Sprint";
import { convertTimeStringToHours } from "@utils/datetimeUtils";

// Validation schema
const planningSchema = z.object({
	members: z.array(
		z.object({
			availableHours: z.number().default(0),
			userId: z.string(),
		})
	),
	apps: z.array(
		z.object({
			applicationId: z.string(),
			members: z.array(
				z.object({
					percentage: z.number().min(0, "Percentage must be greater than 0").max(100, "Percentage must be less than 100").default(0),
					availableHours: z.number().default(0),
					userId: z.string(),
				})
			),
			availableHours: z.number().default(0),
			plannedHours: z.number().default(0),
		})
	),
	availableHours: z.number().default(0),
	buffer: z.number().min(0, "Buffer must be greater than 0").max(100, "Buffer must be less than 100").default(0),
});

type PlanningFormData = z.infer<typeof planningSchema>;

interface Props {
	sprint: Sprint;
	members: User[];
	apps: Array<{ id: string; name: string; members: User[] }>;
}

export default function PlanningForm({ sprint, members, apps }: Props) {
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm<PlanningFormData>({
		resolver: zodResolver(planningSchema),
	});

	const onSubmit = async (data: PlanningFormData) => {
		console.log(data);
	};

	const [buffer, setBuffer] = useState(0);
	const [plannedHours, setPlannedHours] = useState<{ [key: number]: number }>({});
	const [timeInputs, setTimeInputs] = useState<{ [key: number]: string }>({});

	const handleHoursChange = (appIndex: number, direction: 1 | -1) => {
		const timeString = timeInputs[appIndex] || "";
		const hoursToAdd = timeString ? convertTimeStringToHours(timeString) : 0;
		const currentHours = plannedHours[appIndex] || 0;
		const newHours = Math.max(0, currentHours + hoursToAdd * direction);

		setPlannedHours((prev) => ({ ...prev, [appIndex]: newHours }));
		setTimeInputs((prev) => ({ ...prev, [appIndex]: "" }));
		setValue(`apps.${appIndex}.plannedHours`, newHours);
	};

	const handleTimeInput = (appIndex: number, value: string) => {
		setTimeInputs((prev) => ({ ...prev, [appIndex]: value }));
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
			<main className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
				<header>
					<h1 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Sprint Planning: {sprint.name}</h1>
				</header>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">⏰ Total hours available</h2>
					<ul className="flex flex-row flex-wrap gap-4">
						{members.map((member, memberIndex) => (
							<li
								key={member.id}
								className="flex flex-col items-center p-6 bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700"
							>
								<input type="hidden" {...register(`members.${memberIndex}.userId`)} value={member.id} />
								<img src={member.imageUrl} alt={member.name} className="w-12 h-12 rounded-full" />
								<h3 className="mt-3 text-base font-medium text-gray-900 dark:text-white">{member.name}</h3>
								<div className="mt-3 w-full max-w-[120px]">
									<input
										type="number"
										min="0"
										placeholder="Hours/week"
										defaultValue={0}
										className="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 text-center"
										{...register(`members.${memberIndex}.availableHours`, {
											valueAsNumber: true,
											min: 0,
										})}
									/>
									{errors.members?.[memberIndex]?.availableHours && (
										<p role="alert" className="text-red-500 dark:text-red-400 text-xs mt-1 text-center">{errors.members[memberIndex]?.availableHours?.message}</p>
									)}
								</div>
							</li>
						))}
					</ul>
				</section>

				<section className="mt-6">
					<h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📱 Applications</h2>
					<ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{apps?.map((app, appIndex) => (
							<li key={app.id} className="p-6 bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700">
								<input type="hidden" {...register(`apps.${appIndex}.applicationId`)} value={app.id} />
								<h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">{app.name}</h3>
								<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
									{app.members?.map((member, memberIndex) => (
										<li
											key={member.id}
											className="flex flex-col p-4 bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700"
										>
											<input type="hidden" {...register(`apps.${appIndex}.members.${memberIndex}.userId`)} value={member.id} />
											<div className="flex items-center gap-3 mb-3">
												<img src={member.imageUrl} alt={member.name} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-600" />
												<span className="text-sm font-medium text-gray-900 dark:text-white truncate">{member.name}</span>
											</div>
											<div className="flex items-center gap-3">
												<div className="relative flex-1">
													<input
														type="number"
														min="0"
														max="100"
														placeholder="0"
														defaultValue={0}
														className="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 text-center pr-8"
														{...register(`apps.${appIndex}.members.${memberIndex}.percentage`, {
															valueAsNumber: true,
															min: 0,
															max: 100,
														})}
													/>
													<span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">%</span>
												</div>
											</div>
											{errors.apps?.[appIndex]?.members?.[memberIndex]?.percentage && (
												<p role="alert" className="text-red-500 dark:text-red-400 text-xs mt-2">{errors.apps[appIndex]?.members[memberIndex]?.percentage?.message}</p>
											)}
										</li>
									))}
								</ul>
							</li>
						))}
					</ul>
				</section>

				<hr className="h-px my-6 bg-gray-200 border-0 dark:bg-gray-700" />

				<section className="mt-6">
					<h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">⚙️ Buffer</h2>
					<div className="w-full">
						<label htmlFor="buffer" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
							Buffer percentage
						</label>
						<div className="flex items-center gap-4">
							<input
								id="buffer"
								type="range"
								min="0"
								max="100"
								defaultValue={0}
								{...register("buffer", {
									valueAsNumber: true,
									min: 0,
									max: 100,
								})}
								className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
							/>
							<output className="flex min-w-[3rem] items-center justify-center text-sm font-medium text-gray-900 dark:text-white">{watch("buffer") || 0}%</output>
						</div>
						{errors.buffer && <p role="alert" className="text-red-500 dark:text-red-400 text-xs mt-2">{errors.buffer.message}</p>}
					</div>
				</section>

				<hr className="h-px my-6 bg-gray-200 border-0 dark:bg-gray-700" />

				<section className="mt-6">
					<h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📝 Plan hours</h2>

					<div className="grid grid-cols-2 gap-4 mb-8">
						<article className="flex flex-col items-center text-center p-4">
							<p className="text-4xl font-bold text-gray-900 dark:text-white">
								{Math.round((watch("members")?.reduce((sum, member) => sum + (member.availableHours || 0), 0) || 0) * (1 - (watch("buffer") || 0) / 100))} hours
							</p>
							<p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Total available hours after {watch("buffer") || 0}% buffer</p>
						</article>
						<article className="flex flex-col items-center text-center p-4">
							<p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{Object.values(plannedHours).reduce((sum, hours) => sum + hours, 0)} hours</p>
							<p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Total planned hours</p>
						</article>
					</div>

					<ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{apps?.map((app, appIndex) => (
							<li key={app.id} className="p-6 bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700">
								<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{app.name}</h3>

								<div className="space-y-4">
									<dl className="flex justify-between items-center">
										<dt className="text-sm text-gray-600 dark:text-gray-400">Total Hours:</dt>
										<dd className="text-lg font-semibold text-gray-900 dark:text-white">
											{Math.round(
												(watch(`apps.${appIndex}.members`)?.reduce((sum, appMember) => {
													const memberHours = watch("members")?.find((m) => m.userId === appMember.userId)?.availableHours || 0;
													return sum + memberHours * (appMember.percentage / 100);
												}, 0) || 0) *
													(1 - (watch("buffer") || 0) / 100)
											) || 0}
											h
										</dd>
									</dl>

									<dl className="flex justify-between items-center">
										<dt className="text-sm text-gray-600 dark:text-gray-400">Planned:</dt>
										<dd className="text-lg font-semibold text-blue-600 dark:text-blue-400">{plannedHours[appIndex] || 0}h</dd>
									</dl>

									<div className="relative flex items-center gap-2">
										<button
											type="button"
											onClick={() => handleHoursChange(appIndex, -1)}
											className="p-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
											aria-label="Decrease hours"
										>
											-
										</button>
										<input
											type="text"
											placeholder="0m 0w 0d 0h"
											value={timeInputs[appIndex] || ""}
											onChange={(e) => handleTimeInput(appIndex, e.target.value)}
											className="flex-1 p-2.5 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 text-center"
											aria-label="Time input"
										/>
										<button
											type="button"
											onClick={() => handleHoursChange(appIndex, 1)}
											className="p-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
											aria-label="Increase hours"
										>
											+
										</button>
									</div>
								</div>
							</li>
						))}
					</ul>
				</section>

				<footer className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
					<a
						href={`/sprints/${sprint.id}`}
						className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 text-center"
					>
						❌ Cancel
					</a>
					<button
						type="submit"
						className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
					>
						💾 Save Plan
					</button>
				</footer>
			</main>
		</form>
	);
}
