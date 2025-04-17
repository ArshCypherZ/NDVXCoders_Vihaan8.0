"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clipboard, FileText, Users, Activity } from "lucide-react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { getCurrentUser } from "@/lib/auth"
import { trialsAPI } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    trials: 0,
    reports: 0,
    hospitals: 0,
    pendingReports: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setUser(getCurrentUser())
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      // Fetch trials
      const trialsResponse = await trialsAPI.getAllTrials()

      // Set mock data for now - in a real app, you'd calculate these from API responses
      setStats({
        trials: trialsResponse.length || 0,
        reports: Math.floor(Math.random() * 50) + 10,
        hospitals: Math.floor(Math.random() * 20) + 5,
        pendingReports: Math.floor(Math.random() * 15),
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderWelcomeMessage = () => {
    if (!user) return "Welcome to Veridose"

    switch (user.role) {
      case "hospital":
        return "Hospital Dashboard"
      case "manufacturer":
        return "Manufacturer Dashboard"
      case "regulator":
        return "Regulator Dashboard"
      default:
        return "Welcome to Veridose"
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{renderWelcomeMessage()}</h1>
          <p className="text-muted-foreground">Monitor and manage clinical trials and patient reports</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trials</CardTitle>
              <Clipboard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-7 w-16" /> : <div className="text-2xl font-bold">{stats.trials}</div>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats.reports}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {user?.role === "manufacturer" ? "Participating Hospitals" : "Pending Reports"}
              </CardTitle>
              {user?.role === "manufacturer" ? (
                <Users className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Activity className="h-4 w-4 text-muted-foreground" />
              )}
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <div className="text-2xl font-bold">
                  {user?.role === "manufacturer" ? stats.hospitals : stats.pendingReports}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Analysis</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats.trials > 0 ? "Active" : "Inactive"}</div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recent-activity">Recent Activity</TabsTrigger>
            {user?.role === "manufacturer" && <TabsTrigger value="hospital-requests">Hospital Requests</TabsTrigger>}
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Overview</CardTitle>
                <CardDescription>Summary of your clinical trial management activities</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                {isLoading ? (
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[80%]" />
                    <Skeleton className="h-4 w-[90%]" />
                    <Skeleton className="h-4 w-[70%]" />
                  </div>
                ) : stats.trials === 0 ? (
                  <div className="text-center text-muted-foreground">
                    <p>No trial data available yet.</p>
                    {user?.role === "manufacturer" ? (
                      <p>Create a new trial to get started.</p>
                    ) : user?.role === "hospital" ? (
                      <p>Join a trial to get started.</p>
                    ) : (
                      <p>Monitor trials as they become available.</p>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <p>Trial data visualization will appear here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="recent-activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent actions and updates</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                {isLoading ? (
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[80%]" />
                    <Skeleton className="h-4 w-[90%]" />
                    <Skeleton className="h-4 w-[70%]" />
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <p>No recent activity to display.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          {user?.role === "manufacturer" && (
            <TabsContent value="hospital-requests" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Hospital Join Requests</CardTitle>
                  <CardDescription>Hospitals requesting to join your trials</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  {isLoading ? (
                    <div className="space-y-2 w-full">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-[80%]" />
                      <Skeleton className="h-4 w-[90%]" />
                      <Skeleton className="h-4 w-[70%]" />
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <p>No pending hospital requests.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
