"use client"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
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

interface SprintDetailsHoursProps {
  sprint: SprintDetails;
}

export default function SprintDetailsHours({ sprint }: SprintDetailsHoursProps) {
    const { applications } = sprint;
    const applicationsData = applications.map((application) => ({
        name: application.name,
        availableHours: application.availableHours || 0,
        spentHours: application.spentHours || 0,
        plannedHours: application.plannedHours || 0,
    }));
    const applicationsConfig = {
        availableHours: {
            label: "Available hours",
            color: "rgb(59, 130, 246)", // blue-500
        },
        spentHours: {
            label: "Spent hours", 
            color: "rgb(139, 92, 246)", // violet-500
        },
        plannedHours: {
            label: "Planned hours",
            color: "rgb(14, 165, 233)", // sky-500
        },
    } satisfies ChartConfig
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-700 dark:text-gray-300">Sprint Hours</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">Hours Overview</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={applicationsConfig}>
          <BarChart accessibilityLayer data={applicationsData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: any) => value.slice(0, 3)}
              className="text-gray-600 dark:text-gray-400 text-lg"
            />
            <ChartTooltip 
              content={
                <ChartTooltipContent 
                  hideLabel 
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700" 
                />
              } 
            />
            <ChartLegend content={<ChartLegendContent className="text-gray-600 dark:text-gray-400 text-lg" />} />
            <Bar dataKey="availableHours" fill="var(--color-availableHours)" radius={4} />
            <Bar dataKey="spentHours" fill="var(--color-spentHours)" radius={4} />
            <Bar dataKey="plannedHours" fill="var(--color-plannedHours)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}