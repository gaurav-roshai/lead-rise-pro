"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KanbanBoard } from "./components/kanban-board"
import { StatsCards } from "./components/stats-cards"
import { WeeklyLeadsChart } from "./components/weekly-leads-chart"
import { StatsCardsSkeleton, TopActiveLeadsChartSkeleton, TopProbabilityLeadsChartSkeleton, WeeklyLeadsChartSkeleton } from "@/components/ui/loading-skeletons"
import { TopActiveLeadsChart } from "./components/top-active-leads-charts"
import { TopProbabilityLeadsChart } from "./components/top-probability-leads-charts"
import { toast } from "sonner"

interface DashboardData {
  stats: {
    totalLeads: number
    activeOpportunities: number
    totalDealValue: string
    conversionRate: number
    avgDealSize: string
    avgDealClosure: string
    topSector: string
  }
  weeklyLeads: Array<{
    name: string
    leads: number
  }>
  topActiveLeads: Array<{
    name: string
    activities: number
    sector: string
  }>
  topProbabilityLeads: Array<{
    name: string
    probability: number
    dealValue: number
    stage: string
  }>
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard")
      const data = await response.json()
      setDashboardData(data)
    } catch (error) {
      toast.error("Failed to fetch dashboard data")
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {loading ? <WeeklyLeadsChartSkeleton /> : <WeeklyLeadsChart data={dashboardData?.weeklyLeads} />}
              {loading ? <TopActiveLeadsChartSkeleton /> : <TopActiveLeadsChart data={dashboardData?.topActiveLeads} />}
              {loading ? (
                <TopProbabilityLeadsChartSkeleton />
              ) : (
                <TopProbabilityLeadsChart data={dashboardData?.topProbabilityLeads} />
              )}
            </div>
            {loading ? <StatsCardsSkeleton /> : <StatsCards data={dashboardData?.stats} />}
              
          </TabsContent>
          <TabsContent value="kanban" className="space-y-4">
            <KanbanBoard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
