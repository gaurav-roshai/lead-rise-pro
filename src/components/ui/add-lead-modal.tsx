"use client"

import type React from "react"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { client } from "@/lib/auth-client"
interface AddLeadModalProps {
  children: React.ReactNode
  initialStage?: string
  onLeadAdded?: () => void
}

export function AddLeadModal({ children, initialStage = "qualified", onLeadAdded }: AddLeadModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [productName, setProductName] = useState("")
  const [customProduct, setCustomProduct] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [sector, setSector] = useState("")
  const [region, setRegion] = useState("")
  const [leadSource, setLeadSource] = useState("")
  const [dealValue, setDealValue] = useState("")
  const [probability, setProbability] = useState("")
  const [initialUseCase, setInitialUseCase] = useState("")
  const [contactName, setContactName] = useState("")
  const [contactRole, setContactRole] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [salesOwner, setSalesOwner] = useState("")
  const [stage, setStage] = useState(initialStage)
  const [dealType, setDealType] = useState("")
  const predefinedProducts = ["Retrofit Autonomy", "PDI", "FleetPlus Pro", "ADAS", "Custom"]
  const [users, setUsers] = useState<any[]>([]);
  const capitalizeName = (name: any) => {
    return name
      .toLowerCase()
      .split(' ')
      .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await client.admin.listUsers({
          query: {
            limit: 10,
          },
        });
        if (userData.data?.users) {
          setUsers(userData.data.users);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    fetchUsers();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Determine the final product name
    const finalProductName = productName === "Custom" ? customProduct : productName

    const leadData = {
      customerName: customerName,
      sector: sector,
      region: region,
      leadSource: leadSource,
      dealValue: dealValue,
      productName: finalProductName,
      initialUseCase: initialUseCase,
      contactPerson: {
        name: contactName,
        role: contactRole,
        email: contactEmail,
      },
      salesOwner: salesOwner,
      stage: stage,
      dealType: dealType,
      probability: probability,
    }

    try {
      console.log(leadData)
      console.log("worked")
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadData),
      })

      if (response.ok) {
        setOpen(false)
        setProductName("")
        setCustomProduct("")
        setSector("")
        setRegion("")
        setLeadSource("")
        setDealValue("")
        setProbability("")
        setInitialUseCase("")
        setContactName("")
        setContactRole("")
        setContactEmail("")
        setSalesOwner("")
        setStage("qualified")
        setDealType("")
        
        onLeadAdded?.()
      }
    } catch (error) {
      console.error("Failed to create lead:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
          <DialogDescription>Enter the details of the new lead. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="customer" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="customer">Customer Info</TabsTrigger>
              <TabsTrigger value="contact">Contact Info</TabsTrigger>
            </TabsList>
            <TabsContent value="customer" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input onChange={(e) => setCustomerName(e.target.value)} id="customerName" name="customerName" value={customerName} placeholder="Company name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sector">Sector / Domain</Label>
                  <Select value={sector} onValueChange={setSector} name="sector" defaultValue="logistics">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="logistics">Logistics</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="automotive">Automotive</SelectItem>
                      <SelectItem value="energy">Energy</SelectItem>
                      <SelectItem value="it">IT Services</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="mining">Mining</SelectItem>
                      <SelectItem value="oil">Oil & Gas</SelectItem>
                      <SelectItem value="fmcg">FMCG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Select value={region} onValueChange={setRegion} name="region" defaultValue="west">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="north">India North</SelectItem>
                      <SelectItem value="south">India South</SelectItem>
                      <SelectItem value="east">India East</SelectItem>
                      <SelectItem value="west">India West</SelectItem>
                      <SelectItem value="central">India Central</SelectItem>
                      <SelectItem value="emea">EMEA</SelectItem>
                      <SelectItem value="apac">APAC</SelectItem>
                      <SelectItem value="americas">Americas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leadSource">Lead Source</Label>
                  <Select value={leadSource} onValueChange={setLeadSource} name="leadSource" defaultValue="event">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rfi">RFI</SelectItem>
                      <SelectItem value="rfp">RFP</SelectItem>
                      <SelectItem value="rfq">RFQ</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dealValue">Probablity (%)</Label>
                  <Input value={probability} onChange={(e) => setProbability(e.target.value)} id="dealValue" name="dealValue" type="number" placeholder="0%" required />
                </div>
                <div className="space-y-2">
                <Label htmlFor="dealValue">Deal Value (Cr)</Label>
                <Input value={dealValue} onChange={(e) => setDealValue(parseFloat(e.target.value).toString())} id="dealValue" name="dealValue" type="number" step="0.1" placeholder="0.0" required />
                </div>  
              </div>
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Select value={productName} onValueChange={setProductName} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedProducts.map((product) => (
                      <SelectItem key={product} value={product}>
                        {product}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {productName === "Custom" && (
                <div className="space-y-2">
                  <Label htmlFor="customProduct">Custom Product Name</Label>
                  <Input
                    id="customProduct"
                    value={customProduct}
                    onChange={(e) => setCustomProduct(e.target.value)}
                    placeholder="Enter custom product name"
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="initialUseCase">Initial Use Case / Problem Statement</Label>
                <Textarea
                  value={initialUseCase}
                  onChange={(e) => setInitialUseCase(e.target.value)}
                  id="initialUseCase"
                  name="initialUseCase"
                  placeholder="Describe the customer's problem or use case"
                  className="min-h-[80px]"
                  required
                />
              </div>
            </TabsContent>
            <TabsContent value="contact" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input value={contactName} onChange={(e) => setContactName(e.target.value)} id="contactName" name="contactName" placeholder="Full name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactRole">Contact Role</Label>
                  <Input value={contactRole} onChange={(e) => setContactRole(e.target.value)} id="contactRole" name="contactRole" placeholder="Job title" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} id="contactEmail" name="contactEmail" type="email" placeholder="email@company.com" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salesOwner">Sales Owner</Label>
                  <Select value={salesOwner} onValueChange={setSalesOwner} name="salesOwner" defaultValue="kiran">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select owner" />
                    </SelectTrigger>
                    <SelectContent>
                    {users.map((user: any) => (
                      <SelectItem key={user.id} value={user.id}>
                        {capitalizeName(user.name)}
                      </SelectItem>
                    ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stage">Stage</Label>
                  <Select value={stage} onValueChange={setStage} name="stage" defaultValue={initialStage}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="qualified">Qualified Lead</SelectItem>
                      <SelectItem value="presentation">Capability Presentation</SelectItem>
                      <SelectItem value="proposal">Proposal Stage</SelectItem>
                      <SelectItem value="commercial">Commercial Review</SelectItem>
                      <SelectItem value="legal">Legal Review</SelectItem>
                      <SelectItem value="won">Closed-Won</SelectItem>
                      <SelectItem value="lost">Closed-Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dealType">Deal Type</Label>
                <Select value={dealType} onValueChange={setDealType} name="dealType" defaultValue="poc">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select deal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="poc">PoC</SelectItem>
                    <SelectItem value="pilot">Pilot</SelectItem>
                    <SelectItem value="scale">Scale</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-9">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="h-9">
              {loading ? "Saving..." : "Save Lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
