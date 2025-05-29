"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Filter,
  MoreHorizontal,
  Plus,
  Trash2,
  Trophy,
  X,
  Edit,
  Eye
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { LeadStatusBadge } from "../components/lead-status-badge"
import { AddLeadModal } from "@/components/ui/add-lead-modal"
import { EditLeadModal } from "@/components/ui/edit-lead-modal"
import { LeadsTableSkeleton } from "@/components/ui/loading-skeletons"

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
  probability: number  // Fix spelling from 'probality' and change type to number
}

export default function LeadsPage() {
  const [allLeads, setAllLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [stageFilter, setStageFilter] = useState("all")
  const [sectorFilter, setSectorFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)

  // Get unique values for filter options
  const uniqueStages = useMemo(() => [...new Set(allLeads.map((lead) => lead.stage))], [allLeads])
  const uniqueSectors = useMemo(() => [...new Set(allLeads.map((lead) => lead.sector))], [allLeads])
  const uniqueRegions = useMemo(() => [...new Set(allLeads.map((lead) => lead.region))], [allLeads])

  // Client-side filtering
  const filteredLeads = useMemo(() => {
    return allLeads.filter((lead) => {
      const matchesSearch =
        lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.contactPerson.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.sector.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStage = stageFilter === "all" || lead.stage === stageFilter
      const matchesSector = sectorFilter === "all" || lead.sector === sectorFilter
      const matchesRegion = regionFilter === "all" || lead.region === regionFilter

      return matchesSearch && matchesStage && matchesSector && matchesRegion
    })
  }, [allLeads, searchTerm, stageFilter, sectorFilter, regionFilter])

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/leads")
      const data = await response.json()
      setAllLeads(data.leads)
    } catch (error) {
      console.error("Failed to fetch leads:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const clearFilters = () => {
    setSearchTerm("")
    setStageFilter("all")
    setSectorFilter("all")
    setRegionFilter("all")
  }

  const hasActiveFilters = searchTerm || stageFilter !== "all" || sectorFilter !== "all" || regionFilter !== "all"

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
      
      // Refresh the leads list
      fetchLeads();
    } catch (error) {
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
  
      fetchLeads();
    } catch (error) {
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
      fetchLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <div className="ml-auto flex items-center gap-2">
            <Input
              placeholder="Search leads..."
              className="h-9 w-[200px] lg:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline" size="sm" className="h-9 gap-1" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-3.5 w-3.5" />
              <span>Filter</span>
              {showFilters ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </Button>
            <AddLeadModal onLeadAdded={fetchLeads}>
              <Button size="sm" className="h-9 gap-1 bg-[#1d91d8]">
                <Plus className="h-3.5 w-3.5" />
                <span>Add Lead</span>
              </Button>
            </AddLeadModal>
          </div>
        </div>

        {showFilters && (
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Stage:</span>
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="All stages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All stages</SelectItem>
                  {uniqueStages.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage.charAt(0).toUpperCase() + stage.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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

        {loading ? (
          <LeadsTableSkeleton />
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Customer
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                  </TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No leads found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">#{lead.id}</TableCell>
                      <TableCell>
                        <Link href={`/dashboard/leads/${lead.id}`} className="font-medium hover:underline">
                          {lead.customerName}
                        </Link>
                      </TableCell>
                      <TableCell>{lead.sector}</TableCell>
                      <TableCell>{lead.contactPerson.name}</TableCell>
                      <TableCell>
                        <LeadStatusBadge status={lead.stage} />
                      </TableCell>
                      <TableCell>₹{lead.dealValue} Cr</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="text-green-600 hover:bg-green-600/8" onClick={() => handleMarkAsWon(lead.id)}>
                              <Trophy className="h-4 w-4 text-green-600" />
                              Mark as won
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 hover:bg-red-600/8" onClick={() => handleMarkAsLost(lead.id)}>
                              <X className="h-4 w-4 text-red-600" />
                              Mark as lost
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <div>
                              <Eye className="h-4 w-4 text-black" />

                              <Link href={`/dashboard/leads/${lead.id}`}>View details</Link>
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => setEditingLead(lead)}>
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
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {!loading && filteredLeads.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Showing {filteredLeads.length} of {allLeads.length} leads
          </div>
        )}

        {editingLead && (
          <EditLeadModal
            lead={editingLead}
            open={!!editingLead}
            onClose={() => setEditingLead(null)}
            onLeadUpdated={fetchLeads}
          />
        )}
      </main>
    </div>
  )
}
