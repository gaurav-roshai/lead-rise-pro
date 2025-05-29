"use client"

import { useState, useEffect, useMemo } from "react"
import { ChevronDown, ChevronUp, Filter, MoreHorizontal, Plus, X, Edit, Trophy, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditLeadModal } from "@/components/ui/edit-lead-modal"
import { KanbanBoardSkeleton } from "@/components/ui/loading-skeletons"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { client } from "@/lib/auth-client"
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
  productName: string
  leadSource: string
  initialUseCase: string
  stage: string
  dealValue: number
  dealType: string
  salesOwner: string
  probability: number  // Add missing probability field
}
const userData = await client.admin.listUsers({
  query: {
    limit: 100, // Increase limit to get all users
  },
});

// Create a map of user UUID to user name for quick lookup
const userMap = new Map();
if (userData.data?.users) {
  userData.data.users.forEach((user: any) => {
    userMap.set(user.id, user.name || user.email); // Use name if available, fallback to email
  });
}

export function KanbanBoard() {
  const [allLeads, setAllLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sectorFilter, setSectorFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)

  const uniqueSectors = useMemo(() => [...new Set(allLeads.map((lead) => lead.sector))], [allLeads])
  const uniqueRegions = useMemo(() => [...new Set(allLeads.map((lead) => lead.region))], [allLeads])

  const stages = [
    { id: "qualified", name: "Qualified Lead" },
    { id: "presentation", name: "Capability Presentation" },
    { id: "proposal", name: "Proposal Stage" },
    { id: "commercial", name: "Commercial Review" },
    { id: "legal", name: "Legal Review" },
    { id: "won", name: "Closed-Won" },
    { id: "lost", name: "Closed-Lost" },
  ]

  // Client-side filtering
  const filteredLeads = useMemo(() => {
    return allLeads.filter((lead) => {
      const matchesSearch =
        lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.contactPerson.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.sector.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesSector = sectorFilter === "all" || lead.sector === sectorFilter
      const matchesRegion = regionFilter === "all" || lead.region === regionFilter

      return matchesSearch && matchesSector && matchesRegion
    })
  }, [allLeads, searchTerm, sectorFilter, regionFilter])

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/leads")
      const data = await response.json()
      setAllLeads(data.leads)
    } catch (error) {
      console.error("Failed to fetch leads:", error)
      toast.error("Failed to fetch leads")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const getLeadsByStage = (stage: string) => {
    return filteredLeads.filter((lead) => lead.stage === stage)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSectorFilter("all")
    setRegionFilter("all")
  }

  const hasActiveFilters = searchTerm || sectorFilter !== "all" || regionFilter !== "all"

  const handleMarkAsWon = async (leadId: number) => {
    try {
      console.log("Mark as won:", leadId);
      
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stage: 'won'
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to update lead');
      }
  
      const result = await response.json();
      console.log('Lead marked as won:', result);
      toast.success("Lead marked as won")
      // Refresh the leads list
      fetchLeads();
    } catch (error) {
      toast.error("Failed to mark lead as won")
      console.error('Error marking lead as won:', error);
      // Optional: Add user notification here
    }
  };

  const handleMarkAsLost = async (leadId: number) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stage: 'lost'
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to update lead');
      }
      toast.success("Lead marked as lost")
      fetchLeads();
    } catch (error) {
      toast.error("Failed to mark lead as lost")
      console.error('Error marking lead as lost:', error);
    }
  };

  const handleDeleteLead = async (leadId: number) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete lead');
      }

      // Refresh the leads list after successful deletion
      toast.success("Lead deleted successfully")
      fetchLeads();
    } catch (error) {
      toast.error("Failed to delete lead")
      console.error('Error deleting lead:', error);
    }
  }

  if (loading) {
    return <KanbanBoardSkeleton />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search leads..."
          className="h-9 w-[150px] lg:w-[250px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="outline" size="sm" className="h-9 gap-1" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="h-3.5 w-3.5" />
          <span>Filter</span>
          {showFilters ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </Button>
      </div>

      {showFilters && (
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sector:</span>
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="All sectors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sectors</SelectItem>
                {uniqueSectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Region:</span>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="All regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All regions</SelectItem>
                {uniqueRegions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button variant="destructive" size="sm" className="h-9 gap-1 ml-2" onClick={clearFilters}>
              <X className="h-3.5 w-3.5" />
              <span>Clear</span>
            </Button>
          )}
        </div>
      )}

      <div className="flex h-[calc(100vh-12rem)] gap-4 overflow-auto pb-4">
        {stages.map((stage) => (
          <div key={stage.id} className="flex-shrink-0 w-80">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium">{stage.name}</div>
              <div className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-md">
                {getLeadsByStage(stage.id).length}
              </div>
            </div>
            <ScrollArea className="h-fit">
              <div className="space-y-3 pr-2">
                {getLeadsByStage(stage.id).map((lead) => (
                  <Card
                    key={lead.id}
                    className={cn("cursor-pointer hover:border-primary/50 gap-0 py-0", {
                      "border-l-4 border-l-blue-500": stage.id === "qualified",
                      "border-l-4 border-l-purple-500": stage.id === "presentation",
                      "border-l-4 border-l-green-500": stage.id === "proposal",
                      "border-l-4 border-l-orange-500": stage.id === "commercial",
                      "border-l-4 border-l-yellow-500": stage.id === "legal",
                      "border-l-4 border-l-emerald-500": stage.id === "won",
                      "border-l-4 border-l-red-500": stage.id === "lost",
                    })}
                  >
                    <CardHeader className="p-3 pb-0">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm font-medium">{lead.customerName}</CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="text-green-600 hover:bg-green-500/8" onClick={() => handleMarkAsWon(lead.id)}>
                              <Trophy className="h-4 w-4 text-green-600" />
                              Mark as won
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 hover:bg-red-600/8" onClick={() => handleMarkAsLost(lead.id)}>
                              <X className="h-4 w-4 text-red-600" />
                              Mark as lost
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setEditingLead(lead)}>
                              <Edit className="h-4 w-4 text-black" />
                              Edit lead
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 hover:bg-red-600/8" onClick={() => handleDeleteLead(lead.id)}>
                              <Trash2 className="h-4 w-4 text-red-600" />
                              Delete lead
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="px-3 pt-0 text-xs">
                      <div className="text-muted-foreground mb-2">
                        {lead.sector} • {lead.region}
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">₹{lead.dealValue} Cr</div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-3 pt-0 flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">#{lead.id}</div>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {userMap.get(lead.salesOwner)
                            .split(" ")
                            .map((n: any) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        ))}
      </div>

      {editingLead && (
        <EditLeadModal
          lead={editingLead}
          open={!!editingLead}
          onClose={() => setEditingLead(null)}
          onLeadUpdated={fetchLeads}
        />
      )}
    </div>
  )
}
