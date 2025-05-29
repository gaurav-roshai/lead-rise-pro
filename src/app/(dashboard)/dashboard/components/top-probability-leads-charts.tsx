"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TopProbabilityLeadsData {
  name: string
  probability: number
  dealValue: number
  stage: string
}

interface TopProbabilityLeadsChartProps {
  data?: TopProbabilityLeadsData[]
}

export function TopProbabilityLeadsChart({ data }: TopProbabilityLeadsChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Highest Probability Leads
          </CardTitle>
          <CardDescription>Top 3 leads by win probability</CardDescription>
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
          <TrendingUp className="h-5 w-5" />
          Highest Probability Leads
        </CardTitle>
        <CardDescription>Top 3 leads by win probability</CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <Tooltip
              formatter={(value: any, name: any, props: any) => [`${value}%`, "Win Probability"]}
              labelFormatter={(label: any) => `Company: ${label}`}
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Bar dataKey="probability" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
