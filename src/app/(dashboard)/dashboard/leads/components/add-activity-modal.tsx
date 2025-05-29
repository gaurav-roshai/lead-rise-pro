"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, Mail, MessageSquare, Phone, Upload } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"

interface AddActivityModalProps {
  children: React.ReactNode
  leadId: number
  refresh: () => void
}

export function AddActivityModal({ children, leadId, refresh }: AddActivityModalProps) {
  const [open, setOpen] = useState(false)
  const [activityType, setActivityType] = useState("email")
  const [activityTitle, setActivityTitle] = useState('')
  const [activityDescription, setActivityDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedStage, setSelectedStage] = useState('none')
  const handleRefresh = () => {
    refresh();
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
  
    try {
      // Create activity
      const activityResponse = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          leadId,
          activityTitle,
          activityType,
          activityDescription
        })
      })
  
      if (!activityResponse.ok) {
        throw new Error('Failed to create activity')
      }

      // Update stage if a different stage is selected
      if (selectedStage !== 'none') {
        const stageResponse = await fetch(`/api/leads/${leadId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            stage: selectedStage
          })
        })

        if (!stageResponse.ok) {
          throw new Error('Failed to update lead stage')
        }
      }
  
      // Reset form
      toast.success('Activity added successfully')
      handleRefresh()
      setActivityTitle('')
      setActivityDescription('')
      setActivityType('email')
      setSelectedStage('none')
      setOpen(false)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to add activity')
      // Here you might want to show an error message to the user
    } finally {
      setIsSubmitting(false)
    }
  }

  const getActivityIcon = () => {
    switch (activityType) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "phone":
        return <Phone className="h-4 w-4" />
      case "meeting":
        return <MessageSquare className="h-4 w-4" />
      case "document":
        return <Upload className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Activity</DialogTitle>
          <DialogDescription>
            Record a new activity for this lead and optionally move to the next stage.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="activityTitle">Activity Title</Label>
            <Input id="activityTitle" value={activityTitle} onChange={(e) => setActivityTitle(e.target.value)} placeholder="Brief title for this activity" required />
          </div>

          <div className="space-y-2">
            <Label>Activity Type</Label>
            <RadioGroup defaultValue="email" className="flex flex-wrap gap-4" onValueChange={setActivityType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email" className="flex items-center gap-1 cursor-pointer">
                  <Mail className="h-4 w-4" /> Email
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="phone" id="phone" />
                <Label htmlFor="phone" className="flex items-center gap-1 cursor-pointer">
                  <Phone className="h-4 w-4" /> Phone
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="meeting" id="meeting" />
                <Label htmlFor="meeting" className="flex items-center gap-1 cursor-pointer">
                  <MessageSquare className="h-4 w-4" /> Meeting
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="document" id="document" />
                <Label htmlFor="document" className="flex items-center gap-1 cursor-pointer">
                  <Upload className="h-4 w-4" /> Document
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other" className="flex items-center gap-1 cursor-pointer">
                  <Calendar className="h-4 w-4" /> Other
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activityDescription">Description</Label>
            <Textarea
              value={activityDescription}
              onChange={(e) => setActivityDescription(e.target.value)}
              id="activityDescription"
              placeholder="Describe the activity in detail"
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextStage">Move to Stage</Label>
            <Select 
              defaultValue="none" 
              value={selectedStage} 
              onValueChange={setSelectedStage}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Keep current stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Keep current stage</SelectItem>
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

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" className="text-red-600 border-red-600 hover:text-red-500 hover:bg-red-500/8" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-3 bg-[#1d91d8] hover:bg-[#1d91d8]/80">
              {getActivityIcon()}
              <span>{isSubmitting ? 'Adding...':'Add Activity'}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
