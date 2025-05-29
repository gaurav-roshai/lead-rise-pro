import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[60px] mb-2" />
            <Skeleton className="h-3 w-[120px]" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function WeeklyLeadsChartSkeleton() {
  return (
    <Card className="lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-[120px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <Skeleton className="h-9 w-[120px]" />
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[350px] w-full">
          <Skeleton className="h-full w-full" />
        </div>
      </CardContent>
    </Card>
  )
}

export function LeadsTableSkeleton() {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Sector</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Value</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5].map((i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-[40px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[120px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[80px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[100px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-[80px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[60px]" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-9 w-9 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function KanbanBoardSkeleton() {
  const stages = [
    "Qualified Lead",
    "Capability Presentation",
    "Proposal Stage",
    "Commercial Review",
    "Legal Review",
    "Closed-Won",
    "Closed-Lost",
  ]

  return (
    <div className="flex h-[calc(100vh-12rem)] gap-4 overflow-auto pb-4">
      {stages.map((stage, index) => (
        <div key={index} className="flex-shrink-0 w-80">
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-5 w-6 rounded-md" />
          </div>
          <div className="space-y-3 pr-2">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="p-3 pb-0">
                  <div className="flex items-start justify-between">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-6 w-6" />
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <Skeleton className="h-3 w-[80px] mb-2" />
                  <Skeleton className="h-4 w-[60px]" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function LeadDetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-6 w-[200px]" />
        <Skeleton className="h-6 w-[80px]" />
        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="h-9 w-[60px]" />
          <Skeleton className="h-9 w-[100px]" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px] mb-2" />
              <Skeleton className="h-3 w-[40px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-[150px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="space-y-1">
                  <Skeleton className="h-3 w-[80px]" />
                  <Skeleton className="h-4 w-[120px]" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
export function TopActiveLeadsChartSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-[140px]" />
          <Skeleton className="h-4 w-[180px]" />
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
          <Skeleton className="h-full w-full" />
        </div>
      </CardContent>
    </Card>
  )
}

export function TopProbabilityLeadsChartSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-[160px]" />
          <Skeleton className="h-4 w-[160px]" />
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
          <Skeleton className="h-full w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
