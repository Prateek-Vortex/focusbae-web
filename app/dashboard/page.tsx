"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppUsageChart } from "@/components/app-usage-chart"
import { AppUsageStats } from "@/components/app-usage-stats"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download } from "lucide-react"

interface AppUsageData {
  [key: string]: number
}

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [appUsageData, setAppUsageData] = useState<AppUsageData>({})
  const [isLoading, setIsLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState("today")
  const [hydrated, setHydrated] = useState(false)

  // 🔒 Wait for hydration before checking token
  useEffect(() => {
    setHydrated(true)
  }, [])

  // 🔐 Redirect if no token
  useEffect(() => {
    if (!hydrated) return

    const token = localStorage.getItem("focusbae_token")
    if (!token) {
      router.push("/login")
    }
  }, [hydrated, router])

  // 📊 Fetch usage stats
  useEffect(() => {
    if (!hydrated) return

    const fetchAppUsage = async () => {
      setIsLoading(true)

      try {
        const token = localStorage.getItem("focusbae_token")
        if (!token) throw new Error("No authentication token found")

        let minutes = timeFilter === "hour" ? 60 : timeFilter === "week" ? 10080 : 1440

        const res = await fetch(
          `https://focusbee-cloud.onrender.com/app-usage?since_minutes=${minutes}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        if (!res.ok) throw new Error("Failed to fetch usage")

        const data = await res.json()
        setAppUsageData(data)
      } catch (error) {
        console.error("Error fetching app usage:", error)
        toast({
          title: "Error",
          description: "Failed to load app usage data.",
          variant: "destructive",
        })

        setAppUsageData({
          Chrome: 120,
          VSCode: 45,
          Slack: 30,
          Electron: 10,
          Terminal: 5,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppUsage()
  }, [hydrated, timeFilter, toast])

  const handleExportCSV = () => {
    const csv =
      "data:text/csv;charset=utf-8," +
      "Application,Minutes\n" +
      Object.entries(appUsageData)
        .map(([app, minutes]) => `${app},${minutes}`)
        .join("\n")

    const encodedUri = encodeURI(csv)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `focusbae-app-usage-${timeFilter}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "CSV Exported",
      description: "App usage data downloaded.",
    })
  }

  if (!hydrated) return null // ⏳ Don't render until we're ready

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">App Usage Dashboard</h2>
          <p className="text-muted-foreground">Monitor your productivity and app usage patterns</p>
        </div>
        <Button onClick={handleExportCSV} className="w-full md:w-auto">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Tabs defaultValue="today" value={timeFilter} onValueChange={setTimeFilter}>
        <TabsList>
          <TabsTrigger value="hour">Last Hour</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
        </TabsList>
        <TabsContent value="hour" className="space-y-6">
          <AppUsageContent data={appUsageData} isLoading={isLoading} timeFilter="Last Hour" />
        </TabsContent>
        <TabsContent value="today" className="space-y-6">
          <AppUsageContent data={appUsageData} isLoading={isLoading} timeFilter="Today" />
        </TabsContent>
        <TabsContent value="week" className="space-y-6">
          <AppUsageContent data={appUsageData} isLoading={isLoading} timeFilter="This Week" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface AppUsageContentProps {
  data: AppUsageData
  isLoading: boolean
  timeFilter: string
}

function AppUsageContent({ data, isLoading, timeFilter }: AppUsageContentProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>App Usage ({timeFilter})</CardTitle>
          <CardDescription>Time spent on different applications</CardDescription>
        </CardHeader>
        <CardContent>
          <AppUsageChart data={data} isLoading={isLoading} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Usage Stats</CardTitle>
          <CardDescription>Detailed breakdown of your app usage</CardDescription>
        </CardHeader>
        <CardContent>
          <AppUsageStats data={data} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}
