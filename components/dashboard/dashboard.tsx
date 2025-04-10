"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TicketCard } from "../tickets/ticket-card"
import { MetricCard } from "./metric-card"
import { ActivityStream } from "./activity-stream"
import { CreateTicketDialog } from "../tickets/create-ticket-dialog"
// Add a useLayoutEffect to stabilize the layout before rendering charts and metrics
// Import useLayoutEffect
import { useState, useLayoutEffect } from "react"
import React from "react"
import { SystemStatus } from "@/components/system-status"

// Replace the existing useState declaration with this
// Add this state and useLayoutEffect after the useState declarations
export function Dashboard() {
  const [tickets, setTickets] = useState([
    {
      id: "ABC-123",
      title: "Payment gateway integration failing",
      type: "bug",
      priority: "high",
      status: "in-progress",
      project: "Payment System",
    },
    {
      id: "ABC-124",
      title: "Add user profile settings page",
      type: "task",
      priority: "medium",
      status: "to-do",
      project: "User Management",
    },
    {
      id: "ABC-125",
      title: "Fix responsive layout on mobile",
      type: "bug",
      priority: "medium",
      status: "in-progress",
      project: "Frontend",
    },
  ])

  const [isStable, setIsStable] = useState(false)

  useLayoutEffect(() => {
    // Set a small timeout to ensure the layout is stable before rendering charts
    const timer = setTimeout(() => {
      setIsStable(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const handleTicketCreated = (ticketData: any) => {
    // Generate a mock ID for the new ticket
    const newId = `ABC-${126 + tickets.length}`

    // Add the new ticket to the list
    const newTicket = {
      id: newId,
      title: ticketData.title,
      type: ticketData.type,
      priority: ticketData.priority,
      status: "to-do",
      project: ticketData.project,
    }

    setTickets([...tickets, newTicket])
  }

  // Modify the return statement to conditionally render content
  // Wrap the content in a fragment with a key to force a clean remount
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <div>
          <h1 className="text-balance">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, John Doe</p>
        </div>
        <div className="flex items-center space-x-2">
          <CreateTicketDialog
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Ticket
              </Button>
            }
            onTicketCreated={handleTicketCreated}
          />
        </div>
      </div>

      {isStable ? (
        <React.Fragment key="stable-content">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Open Tickets" value="12" trend="+2" trendType="negative" description="Since last week" />
            <MetricCard
              title="Assigned to You"
              value="5"
              trend="-1"
              trendType="positive"
              description="Since yesterday"
            />
            <MetricCard title="Due This Week" value="3" trend="0" trendType="neutral" description="No change" />
            <MetricCard title="Completed" value="8" trend="+3" trendType="positive" description="Since last week" />
          </div>

          <Tabs defaultValue="assigned">
            <TabsList>
              <TabsTrigger value="assigned">Assigned to You</TabsTrigger>
              <TabsTrigger value="recent">Recently Updated</TabsTrigger>
              <TabsTrigger value="watching">Watching</TabsTrigger>
            </TabsList>
            <TabsContent value="assigned" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    id={ticket.id}
                    title={ticket.title}
                    type={ticket.type}
                    priority={ticket.priority}
                    status={ticket.status}
                    project={ticket.project}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="recent" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <TicketCard
                  id="ABC-126"
                  title="Update documentation for API v2"
                  type="task"
                  priority="low"
                  status="in-review"
                  project="Documentation"
                />
                <TicketCard
                  id="ABC-127"
                  title="Implement dark mode toggle"
                  type="feature"
                  priority="medium"
                  status="to-do"
                  project="Frontend"
                />
              </div>
            </TabsContent>
            <TabsContent value="watching" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <TicketCard
                  id="ABC-128"
                  title="Database performance optimization"
                  type="task"
                  priority="high"
                  status="in-progress"
                  project="Backend"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates across your projects</CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityStream />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
                <CardDescription>Tickets by status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { status: "To Do", count: 8, percentage: 40, color: "bg-blue-500" },
                    { status: "In Progress", count: 5, percentage: 25, color: "bg-yellow-500" },
                    { status: "In Review", count: 3, percentage: 15, color: "bg-purple-500" },
                    { status: "Done", count: 4, percentage: 20, color: "bg-green-500" },
                  ].map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.status}</span>
                        <span className="font-medium">{item.count} tickets</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                        <div
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <SystemStatus />
          </div>
        </React.Fragment>
      ) : (
        // Show a simple loading state while layout stabilizes
        <div className="py-8 text-center">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      )}
    </div>
  )
}
