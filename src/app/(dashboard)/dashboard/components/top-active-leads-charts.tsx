"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Activity } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TopActiveLeadsData {
  name: string
  activities: number
  sector: string
}

interface TopActiveLeadsChartProps {
  data?: TopActiveLeadsData[]
}

export function TopActiveLeadsChart({ data }: TopActiveLeadsChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Most Active Leads
          </CardTitle>
          <CardDescription>Top 3 leads by number of activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">No data available</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Most Active Leads
        </CardTitle>
        <CardDescription>Top 3 leads by number of activities</CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }}/>
            <YAxis tick={{ fontSize: 12 }} domain={[0, "dataMax + 4"]} tickCount={6} />
            <Tooltip
              formatter={(value: any, name: any, props: any) => [`${value} activities`, "Activities"]}
              labelFormatter={(label: any) => `Company: ${label}`}
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Bar dataKey="activities" fill="#ffa500" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
