"use client"

import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

interface AppUsageStatsProps {
  data: Record<string, number>
  isLoading: boolean
}

export function AppUsageStats({ data, isLoading }: AppUsageStatsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (Object.keys(data).length === 0) {
    return <p className="text-muted-foreground">No app usage data available</p>
  }

  // Calculate total minutes
  const totalMinutes = Object.values(data).reduce((sum, minutes) => sum + minutes, 0)

  // Sort apps by usage (descending)
  const sortedApps = Object.entries(data).sort(([, minutesA], [, minutesB]) => minutesB - minutesA)

  return (
    <div className="space-y-4">
      {sortedApps.map(([app, minutes]) => {
        const percentage = totalMinutes > 0 ? (minutes / totalMinutes) * 100 : 0

        return (
          <div key={app} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{app}</span>
              <span className="text-muted-foreground">{minutes} min</span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        )
      })}

      <div className="pt-4 border-t">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Total Time</span>
          <span className="font-bold">{totalMinutes} minutes</span>
        </div>
      </div>
    </div>
  )
}
