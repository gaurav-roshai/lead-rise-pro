"use client"

import { useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Calendar, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface WeeklyLeadsData {
  name: string
  leads: number
}

interface WeeklyLeadsChartProps {
  data?: WeeklyLeadsData[]
}

export function WeeklyLeadsChart({ data }: WeeklyLeadsChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("May 2025")

  const defaultData = [
    { name: "Week 1", leads: 0 },
    { name: "Week 2", leads: 0 },
    { name: "Week 3", leads: 0 },
    { name: "Week 4", leads: 0 },
    { name: "Week 5", leads: 0 },
  ]

  const chartData = data || defaultData

  return (
    <Card className="lg:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Weekly Leads</CardTitle>
          <CardDescription>Number of new leads added per week</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1 h-9">
              <Calendar className="h-3.5 w-3.5" />
              <span>{selectedPeriod}</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedPeriod("May 2025")}>May 2025</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedPeriod("April 2025")}>April 2025</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedPeriod("March 2025")}>March 2025</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedPeriod("February 2025")}>February 2025</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedPeriod("January 2025")}>January 2025</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="pl-0">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="leads" name="New Leads" fill="#1d91d8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
