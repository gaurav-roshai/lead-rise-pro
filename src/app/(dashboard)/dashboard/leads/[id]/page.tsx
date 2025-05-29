"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Edit, Phone, Send, Package } from "lucide-react"
import { useParams } from 'next/navigation'
import { client } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LeadStatusBadge } from "../../components/lead-status-badge"
import { LeadTimeline } from "../components/lead-timeline"
import { AddActivityModal } from "../components/add-activity-modal"
import { EditLeadModal } from "@/components/ui/edit-lead-modal"
import { LeadDetailSkeleton } from "@/components/ui/loading-skeletons"

interface Lead {
  id: number
  customerName: string
  sector: string
  region: string
  contactPerson: {
    name: string
    role: string
    email: string
  }
  leadSource: string
  productName: string
  initialUseCase: string
  stage: string
  dealValue: number
  dealType: string
  salesOwner: string
  probability: number  // Fix spelling from 'probablity'
  dateAdded: string
}
const userData = await client.admin.listUsers({
  query: {
    limit: 100, // Increase limit to get all users
  },
});
const capitalizeName = (name: any) => {
    return name
      .toLowerCase()
      .split(' ')
      .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
// Create a map of user UUID to user name for quick lookup
const userMap = new Map();
if (userData.data?.users) {
  userData.data.users.forEach((user: any) => {
    userMap.set(user.id, user.name || user.email); // Use name if available, fallback to email
  });
}

export default function LeadDetailPage() {
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [activities, setActivities] = useState<any>([]);
  const params = useParams<{ id: string; }>()
  const fetchLead = async () => {
    try {
      const response = await fetch("/api/leads")
      const data = await response.json()
      const response2 = await fetch(`/api/activities/?lead_id=${params.id}`)
      
      const data2 = await response2.json()
      setActivities(data2.activities)

      const foundLead = data.leads.find((l: Lead) => l.id.toString() === params.id)
      setLead(foundLead || null)
    } catch (error) {
      console.error("Failed to fetch lead:", error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchLead()
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <LeadDetailSkeleton />
        </main>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="text-center py-8">Lead not found</div>
        </main>
      </div>
    )
  }
const currentDate = new Date();
const dateAdded = new Date(lead.dateAdded);
const timeDiff = Math.abs(currentDate.getTime() - dateAdded.getTime());
const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="h-9 w-9">
            <Link href="/dashboard/leads">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">
            {lead.customerName}
            <span className="text-muted-foreground ml-2">#{lead.id}</span>
          </h1>
          <LeadStatusBadge status={lead.stage} className="ml-2" />
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1 h-9" onClick={() => setEditingLead(lead)}>
              <Edit className="h-3.5 w-3.5" />
              <span>Edit</span>
            </Button>
            <AddActivityModal leadId={lead.id} refresh={fetchLead}>
              <Button size="sm" className="gap-1 h-9 bg-[#1d91d8]">
                <span>Add Activity</span>
              </Button>
            </AddActivityModal>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Deal Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{lead.dealValue} Cr</div>
                  <p className="text-xs text-muted-foreground">{lead.dealType}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Product Name</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{lead.productName || "N/A"}</div>
                  <p className="text-xs text-muted-foreground">Product offering</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Lead Age</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{diffDays} days</div>
                  <p className="text-xs text-muted-foreground">Since qualification</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.floor(Math.random() * 10) + 1} days ago</div>
                  <p className="text-xs text-muted-foreground">Email sent</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="md:col-span-1 h-fit">
                <CardHeader>
                  <CardTitle>Lead Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 grid grid-cols-2">
                  <div>
                    <div className="text-sm font-medium">Company</div>
                    <div>{lead.customerName}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Sector</div>
                    <div>{lead.sector}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Region</div>
                    <div>{lead.region}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Lead Source</div>
                    <div>{lead.leadSource}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Product Name</div>
                    <div>{lead.productName || "Not specified"}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Initial Use Case</div>
                    <div>{lead.initialUseCase}</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="md:col-span-1 h-fit">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {lead.contactPerson.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{lead.contactPerson.name}</div>
                      <div className="text-sm text-muted-foreground">{lead.contactPerson.role}</div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">{lead.contactPerson.email}</div>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-sm font-medium">Assigned Owner</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className=" flex justify-center items-center h-10 w-10">
                        <AvatarFallback>
                        {userMap.get(lead.salesOwner)
                            .split(" ")
                            .map((n: any) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>{capitalizeName(userMap.get(lead.salesOwner))}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full gap-1 h-9">
                    <Send className="h-3.5 w-3.5" />
                    <span>Send Email</span>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Lead Timeline</CardTitle>
                <CardDescription>Track the progress of this lead through the sales pipeline</CardDescription>
              </CardHeader>
              <CardContent>
                <LeadTimeline activities={activities} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {editingLead && (
          <EditLeadModal
            lead={editingLead}
            open={!!editingLead}
            onClose={() => setEditingLead(null)}
            onLeadUpdated={fetchLead}
          />
        )}
      </main>
    </div>
  )
}

function Mail(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}
