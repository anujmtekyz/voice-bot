"use client"

import { useState } from "react"
import {
  AlertCircle,
  ArrowLeft,
  Bug,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  Edit,
  FileText,
  Lightbulb,
  MessageSquare,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface TicketDetailProps {
  id: string
}

export function TicketDetail({ id }: TicketDetailProps) {
  const [comment, setComment] = useState("")

  // Mock data for the ticket
  const ticket = {
    id,
    title: "Payment gateway integration failing",
    description:
      "When users attempt to make a payment using the new payment gateway, they receive a timeout error after 30 seconds. This is happening in approximately 40% of payment attempts.",
    type: "bug",
    priority: "high",
    status: "in-progress",
    project: "Payment System",
    reporter: "Jane Smith",
    assignee: "John Doe",
    created: "2023-08-15T10:30:00Z",
    updated: "2023-08-18T14:45:00Z",
    comments: [
      {
        id: 1,
        author: "Jane Smith",
        text: "I've been able to reproduce this consistently in the staging environment. It seems to happen more frequently with larger transaction amounts.",
        timestamp: "2023-08-16T09:15:00Z",
      },
      {
        id: 2,
        author: "John Doe",
        text: "I've identified the issue. The payment gateway has a timeout setting that's too short for our transaction processing. I'll implement a fix today.",
        timestamp: "2023-08-17T11:30:00Z",
      },
    ],
    activity: [
      {
        id: 1,
        type: "status",
        user: "John Doe",
        from: "to-do",
        to: "in-progress",
        timestamp: "2023-08-16T08:30:00Z",
      },
      {
        id: 2,
        type: "priority",
        user: "Jane Smith",
        from: "medium",
        to: "high",
        timestamp: "2023-08-16T10:45:00Z",
      },
      {
        id: 3,
        type: "assignment",
        user: "Project Manager",
        to: "John Doe",
        timestamp: "2023-08-15T14:20:00Z",
      },
    ],
  }

  const getTypeIcon = () => {
    switch (ticket.type) {
      case "bug":
        return <Bug className="h-5 w-5" />
      case "feature":
        return <Lightbulb className="h-5 w-5" />
      case "task":
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getStatusInfo = () => {
    switch (ticket.status) {
      case "to-do":
        return { icon: <Clock className="h-5 w-5" />, label: "To Do", color: "text-blue-500 bg-blue-50" }
      case "in-progress":
        return {
          icon: <AlertCircle className="h-5 w-5" />,
          label: "In Progress",
          color: "text-yellow-500 bg-yellow-50",
        }
      case "in-review":
        return { icon: <FileText className="h-5 w-5" />, label: "In Review", color: "text-purple-500 bg-purple-50" }
      case "done":
        return { icon: <CheckCircle className="h-5 w-5" />, label: "Done", color: "text-green-500 bg-green-50" }
      default:
        return { icon: <Clock className="h-5 w-5" />, label: ticket.status, color: "text-gray-500 bg-gray-50" }
    }
  }

  const getPriorityColor = () => {
    switch (ticket.priority) {
      case "high":
        return "text-red-500 bg-red-50"
      case "medium":
        return "text-yellow-500 bg-yellow-50"
      case "low":
      default:
        return "text-blue-500 bg-blue-50"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleSubmitComment = () => {
    if (comment.trim()) {
      // In a real app, this would send the comment to the server
      console.log("Submitting comment:", comment)
      setComment("")
    }
  }

  const { icon: statusIcon, label: statusLabel, color: statusColor } = getStatusInfo()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/tickets">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to tickets
          </Link>
        </Button>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <span>Change Status</span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>To Do</DropdownMenuItem>
              <DropdownMenuItem>In Progress</DropdownMenuItem>
              <DropdownMenuItem>In Review</DropdownMenuItem>
              <DropdownMenuItem>Done</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-2">
          <div className="rounded-full bg-gray-100 p-1">{getTypeIcon()}</div>
          <h1 className="text-2xl font-bold tracking-tight">
            {ticket.id}: {ticket.title}
          </h1>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className={cn("flex items-center rounded-full px-2 py-1 text-xs font-medium", statusColor)}>
            {statusIcon}
            <span className="ml-1">{statusLabel}</span>
          </span>
          <span className={cn("rounded-full px-2 py-1 text-xs font-medium", getPriorityColor())}>
            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
          </span>
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium">{ticket.project}</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">Assignee</h3>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{ticket.assignee}</span>
                </div>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">Reporter</h3>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{ticket.reporter}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">Created</h3>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(ticket.created)}</span>
                </div>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">Updated</h3>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(ticket.updated)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{ticket.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
          <CardDescription>{ticket.comments.length} comments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {ticket.comments.map((comment) => (
            <div key={comment.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="font-medium">{comment.author}</div>
                <div className="text-xs text-muted-foreground">{formatDate(comment.timestamp)}</div>
              </div>
              <p className="text-sm">{comment.text}</p>
              <Separator className="mt-2" />
            </div>
          ))}

          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button onClick={handleSubmitComment} disabled={!comment.trim()}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Add Comment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <CardDescription>{ticket.activity.length} changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ticket.activity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="rounded-full bg-gray-100 p-1">
                  {activity.type === "status" && <Clock className="h-4 w-4" />}
                  {activity.type === "priority" && <AlertCircle className="h-4 w-4" />}
                  {activity.type === "assignment" && <User className="h-4 w-4" />}
                </div>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{" "}
                    {activity.type === "status" && (
                      <>
                        changed status from <span className="font-medium">{activity.from}</span> to{" "}
                        <span className="font-medium">{activity.to}</span>
                      </>
                    )}
                    {activity.type === "priority" && (
                      <>
                        changed priority from <span className="font-medium">{activity.from}</span> to{" "}
                        <span className="font-medium">{activity.to}</span>
                      </>
                    )}
                    {activity.type === "assignment" && (
                      <>
                        assigned this ticket to <span className="font-medium">{activity.to}</span>
                      </>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
