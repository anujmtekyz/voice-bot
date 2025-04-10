"use client"

import type React from "react"

import { useState } from "react"
import { Bug, FileText, Lightbulb } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface CreateTicketDialogProps {
  trigger?: React.ReactNode
  defaultProject?: string
  onTicketCreated?: (ticketData: any) => void
}

export function CreateTicketDialog({ trigger, defaultProject, onTicketCreated }: CreateTicketDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ticketType, setTicketType] = useState<string>("task")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [project, setProject] = useState(defaultProject || "")
  const [priority, setPriority] = useState("medium")
  const [assignee, setAssignee] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Create ticket data object
    const ticketData = {
      title,
      description,
      type: ticketType,
      project,
      priority,
      assignee: assignee || null,
      status: "to-do",
      created: new Date().toISOString(),
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)

      // Call the onTicketCreated callback if provided
      if (onTicketCreated) {
        onTicketCreated(ticketData)
      }

      // Reset form and close dialog
      resetForm()
      setOpen(false)
    }, 1000)
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setTicketType("task")
    setPriority("medium")
    setAssignee("")
    if (!defaultProject) {
      setProject("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Ticket</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new ticket. Required fields are marked with an asterisk (*).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue={ticketType} onValueChange={setTicketType} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bug" className="flex items-center space-x-2">
                <Bug className="h-4 w-4" />
                <span>Bug</span>
              </TabsTrigger>
              <TabsTrigger value="task" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Task</span>
              </TabsTrigger>
              <TabsTrigger value="feature" className="flex items-center space-x-2">
                <Lightbulb className="h-4 w-4" />
                <span>Feature</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bug" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bug-title">
                  Bug Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="bug-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Payment gateway integration failing"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bug-description">
                  Steps to Reproduce <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="bug-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the bug in detail with steps to reproduce..."
                  className="min-h-[120px]"
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="task" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">
                  Task Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="task-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Update user documentation"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-description">Description</Label>
                <Textarea
                  id="task-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the task in detail..."
                  className="min-h-[120px]"
                />
              </div>
            </TabsContent>

            <TabsContent value="feature" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="feature-title">
                  Feature Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="feature-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Add dark mode support"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feature-description">
                  Feature Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="feature-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the feature and its requirements..."
                  className="min-h-[120px]"
                  required
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="project">
                Project <span className="text-red-500">*</span>
              </Label>
              <Select value={project} onValueChange={setProject} required>
                <SelectTrigger id="project">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payment-system">Payment System</SelectItem>
                  <SelectItem value="user-management">User Management</SelectItem>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="documentation">Documentation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">
                Priority <span className="text-red-500">*</span>
              </Label>
              <Select value={priority} onValueChange={setPriority} required>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignee">Assignee</Label>
            <Select value={assignee} onValueChange={setAssignee}>
              <SelectTrigger id="assignee">
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="john-doe">John Doe</SelectItem>
                <SelectItem value="jane-smith">Jane Smith</SelectItem>
                <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                <SelectItem value="sarah-williams">Sarah Williams</SelectItem>
                <SelectItem value="david-brown">David Brown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title || !project}
              className={cn(isSubmitting && "opacity-70 cursor-not-allowed")}
            >
              {isSubmitting ? "Creating..." : "Create Ticket"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
