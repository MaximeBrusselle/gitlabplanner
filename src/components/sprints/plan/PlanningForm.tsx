import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@myTypes/User";
import type { Sprint } from "@myTypes/Sprint";

// Validation schema
const planningSchema = z.object({
  members: z.array(z.object({
    totalHours: z.number().default(0),
    userId: z.string()
  })),
  apps: z.array(z.object({
    applicationId: z.string(),
    members: z.array(z.object({
      percentage: z.number().min(0, "Percentage must be greater than 0").max(100, "Percentage must be less than 100").default(0),
      userId: z.string()
    }))
  }))
});

type PlanningFormData = z.infer<typeof planningSchema>;

interface Props {
  sprint: Sprint;
  members: User[];
  apps: Array<{id: string, name: string, members: User[]}>;
}

export default function PlanningForm({ sprint, members, apps }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlanningFormData>({
    resolver: zodResolver(planningSchema)
  });

  const onSubmit = async (data: PlanningFormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Sprint Planning: {sprint.name}</h2>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">⏰ Total hours available</h3>
          <div className="flex flex-row flex-wrap gap-4">
            {members.map((member, memberIndex) => (
              <div key={member.id} className="flex flex-col items-center p-6 bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700">
                <input type="hidden" {...register(`members.${memberIndex}.userId`)} value={member.id} />
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-12 h-12 rounded-full"
                />
                <h4 className="mt-3 text-base font-medium text-gray-900 dark:text-white">{member.name}</h4>
                <div className="mt-3 w-full max-w-[120px]">
                  <input
                    type="number"
                    min="0"
                    placeholder="Hours/week"
                    defaultValue={0}
                    className="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 text-center"
                    {...register(`members.${memberIndex}.totalHours`, { 
                      valueAsNumber: true,
                      min: 0
                    })}
                  />
                  {errors.members?.[memberIndex]?.totalHours && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1 text-center">
                      {errors.members[memberIndex]?.totalHours?.message}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📱 Applications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {apps?.map((app, appIndex) => (
              <div key={app.id} className="p-6 bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700">
                <input type="hidden" {...register(`apps.${appIndex}.applicationId`)} value={app.id} />
                <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">{app.name}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {app.members?.map((member, memberIndex) => (
                    <div key={member.id} className="flex flex-col p-4 bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700">
                      <input type="hidden" {...register(`apps.${appIndex}.members.${memberIndex}.userId`)} value={member.id} />
                      <div className="flex items-center gap-3 mb-3">
                          <img
                            src={member.imageUrl}
                            alt={member.name}
                            className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-600"
                          />
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {member.name}
                        </span>
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
                              max: 100
                            })}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                            %
                          </span>
                        </div>
                      </div>
                      {errors.apps?.[appIndex]?.members?.[memberIndex]?.percentage && (
                        <p className="text-red-500 dark:text-red-400 text-xs mt-2">
                          {errors.apps[appIndex]?.members[memberIndex]?.percentage?.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="h-px my-6 bg-gray-200 border-0 dark:bg-gray-700" />

        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
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
        </div>
      </div>
    </form>
  );
}
