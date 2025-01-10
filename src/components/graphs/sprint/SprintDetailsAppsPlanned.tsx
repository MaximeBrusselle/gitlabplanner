"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/Card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@components/ui/Chart"
import type { SprintDetails } from "@myTypes/Sprint"

interface SprintDetailsAppsPlannedProps {
  sprint: SprintDetails
}

export default function SprintDetailsAppsPlanned({ sprint }: SprintDetailsAppsPlannedProps) {
    const { applications, plannedHours } = sprint;
    const applicationsData = applications.map((application, index) => {
        const themeColors = [
            "rgb(59, 130, 246)",   // blue-500
            "rgb(139, 92, 246)",   // violet-500 
            "rgb(14, 165, 233)",   // sky-500
            "rgb(99, 102, 241)",   // indigo-500
            "rgb(168, 85, 247)",   // purple-500
            "rgb(236, 72, 153)"    // pink-500
        ];
        return {
            name: application.name,
            plannedHours: application.plannedHours || 0,
            percentage: (application.plannedHours || 0) / plannedHours,
            fill: themeColors[index % themeColors.length]
        };
    });
    const applicationsConfig = {
        ...Object.fromEntries(applicationsData.map(app => [
            app.name,
            {
                label: app.name,
                color: app.fill
            }
        ]))
    } satisfies ChartConfig

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Applications Planned Hours</CardTitle>
                <CardDescription>Planned hours for each application</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={applicationsConfig}
                    className="mx-auto aspect-square max-h-[400px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent 
                                    includeHidden 
                                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                                    formatter={(value, name, props) => {
                                        const percentage = (props.payload.percentage * 100).toFixed(1);
                                        return [`${value} hours (${percentage}%)`];
                                    }}
                                />
                            }
                        />
                        <ChartLegend content={<ChartLegendContent className="text-gray-600 dark:text-gray-400 text-lg" />} />
                        <Pie
                            data={applicationsData}
                            dataKey="plannedHours"
                            nameKey="name"
                            innerRadius="45%"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
