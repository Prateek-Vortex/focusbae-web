"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function DashboardHeader() {
  const pathname = usePathname()
  const [pageTitle, setPageTitle] = useState("Dashboard")

  useEffect(() => {
    if (pathname === "/dashboard") {
      setPageTitle("Dashboard")
    } else if (pathname === "/dashboard/chat") {
      setPageTitle("Chat with Focus Assistant")
    } else if (pathname === "/dashboard/settings") {
      setPageTitle("Settings")
    }
  }, [pathname])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <SidebarTrigger />
      <div className="flex-1">
        <h1 className="text-lg font-semibold">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="relative bg-transparent">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">3</Badge>
          <span className="sr-only">Notifications</span>
        </Button>
        <ModeToggle />
      </div>
    </header>
  )
}
