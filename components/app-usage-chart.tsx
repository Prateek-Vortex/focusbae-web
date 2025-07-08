"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

interface AppUsageChartProps {
  data: Record<string, number>
  isLoading: boolean
}

export function AppUsageChart({ data, isLoading }: AppUsageChartProps) {
  const [chartData, setChartData] = useState<Array<{ name: string; value: number }>>([])

  // Chart colors
  const COLORS = ["#FF6384", "#36A2EB", "#4BC0C0", "#FFCE56", "#9966FF", "#FF9F40"]

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      const formattedData = Object.entries(data).map(([name, value], index) => ({
        name,
        value,
      }))
      setChartData(formattedData)
    }
  }, [data])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Skeleton className="h-[300px] w-[300px] rounded-full" />
      </div>
    )
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">No app usage data available</p>
      </div>
    )
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`${value} minutes`, "Time Spent"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
