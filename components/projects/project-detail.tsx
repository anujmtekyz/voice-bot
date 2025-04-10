"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, BarChart, Briefcase, Edit, Plus, Search, User, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TicketCard } from "../tickets/ticket-card"
import { CreateTicketDialog } from "../tickets/create-ticket-dialog"

interface ProjectDetailProps {
  id: string
}

export function ProjectDetail({ id }: ProjectDetailProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [tickets, setTickets] = useState([
    {
      id: "PAY-123",
      title: "Payment gateway integration failing",
      type: "bug",
      priority: "high",
      status: "in-progress",
      project: "Payment System",
    },
    {
      id: "PAY-124",
      title: "Add support for new payment provider",
      type: "feature",
      priority: "medium",
      status: "to-do",
      project: "Payment System",
    },
    {
      id: "PAY-125",
      title: "Fix transaction timeout issues",
      type: "bug",
      priority: "high",
      status: "in-progress",
      project: "Payment System",
    },
    {
      id: "PAY-126",
      title: "Update payment documentation",
      type: "task",
      priority: "low",
      status: "in-review",
      project: "Payment System",
    },
    {
      id: "PAY-127",
      title: "Implement payment analytics dashboard",
      type: "feature",
      priority: "medium",
      status: "to-do",
      project: "Payment System",
    },
  ])

  const handleTicketCreated = (ticketData: any) => {
    // Generate a mock ID for the new ticket
    const newId = `PAY-${128 + tickets.length - 5}`

    // Add the new ticket to the list
    const newTicket = {
      id: newId,
      title: ticketData.title,
      type: ticketData.type,
      priority: ticketData.priority,
      status: "to-do",
      project: id === "payment-system" ? "Payment System" : "Project Name",
    }

    setTickets([...tickets, newTicket])
  }

  // Mock data for the project
  const project = {
    id,
    name: id === "payment-system" ? "Payment System" : "Project Name",
    description:
      "Payment processing and gateway integration for multiple providers. Handles credit cards, digital wallets, and alternative payment methods.",
    ticketCount: 24,
    openTickets: 8,
    inProgressTickets: 5,
    inReviewTickets: 3,
    completedTickets: 8,
    lead: "John Doe",
    members: [
      { id: 1, name: "John Doe", role: "Project Lead" },
      { id: 2, name: "Jane Smith", role: "Developer" },
      { id: 3, name: "Mike Johnson", role: "QA Engineer" },
      { id: 4, name: "Sarah Williams", role: "Designer" },
    ],
  }

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to projects
          </Link>
        </Button>
        <Button variant="outline" size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Edit Project
        </Button>
      </div>

      <div>
        <div className="flex items-center space-x-2">
          <div className="rounded-full bg-gray-100 p-1 dark:bg-gray-800">
            <Briefcase className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
        </div>
        <p className="mt-2 text-muted-foreground">{project.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center justify-center space-y-1 text-center">
              <span className="text-3xl font-bold">{project.ticketCount}</span>
              <span className="text-sm text-muted-foreground">Total Tickets</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center justify-center space-y-1 text-center">
              <span className="text-3xl font-bold text-yellow-500">{project.openTickets}</span>
              <span className="text-sm text-muted-foreground">Open Tickets</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center justify-center space-y-1 text-center">
              <span className="text-3xl font-bold text-blue-500">
                {project.inProgressTickets + project.inReviewTickets}
              </span>
              <span className="text-sm text-muted-foreground">In Progress</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center justify-center space-y-1 text-center">
              <span className="text-3xl font-bold text-green-500">{project.completedTickets}</span>
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets">
        <TabsList>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
                <div>
                  <CardTitle>Project Tickets</CardTitle>
                  <CardDescription>{filteredTickets.length} tickets found</CardDescription>
                </div>
                <CreateTicketDialog
                  trigger={
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Ticket
                    </Button>
                  }
                  defaultProject={id === "payment-system" ? "payment-system" : ""}
                  onTicketCreated={handleTicketCreated}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTickets.map((ticket) => (
                  <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
                    <TicketCard
                      id={ticket.id}
                      title={ticket.title}
                      type={ticket.type}
                      priority={ticket.priority}
                      status={ticket.status}
                      project={ticket.project}
                    />
                  </Link>
                ))}

                {filteredTickets.length === 0 && (
                  <div className="col-span-full py-8 text-center">
                    <p className="text-muted-foreground">No tickets found matching your criteria</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
                <div>
                  <CardTitle>Project Members</CardTitle>
                  <CardDescription>{project.members.length} members in this project</CardDescription>
                </div>
                <Button size="sm">
                  <Users className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Profile
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Analytics</CardTitle>
              <CardDescription>Ticket distribution and progress metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="mb-2 text-sm font-medium">Tickets by Status</h3>
                  <div className="space-y-4">
                    {[
                      {
                        status: "To Do",
                        count: project.openTickets,
                        percentage: (project.openTickets / project.ticketCount) * 100,
                        color: "bg-blue-500",
                      },
                      {
                        status: "In Progress",
                        count: project.inProgressTickets,
                        percentage: (project.inProgressTickets / project.ticketCount) * 100,
                        color: "bg-yellow-500",
                      },
                      {
                        status: "In Review",
                        count: project.inReviewTickets,
                        percentage: (project.inReviewTickets / project.ticketCount) * 100,
                        color: "bg-purple-500",
                      },
                      {
                        status: "Done",
                        count: project.completedTickets,
                        percentage: (project.completedTickets / project.ticketCount) * 100,
                        color: "bg-green-500",
                      },
                    ].map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{item.status}</span>
                          <span className="font-medium">
                            {item.count} tickets ({Math.round(item.percentage)}%)
                          </span>
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
                </div>

                <div className="flex justify-center">
                  <div className="rounded-lg border p-4 text-center">
                    <BarChart className="mx-auto h-16 w-16 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Detailed analytics and reports are available in the full version
                    </p>
                    <Button className="mt-4" variant="outline" size="sm">
                      View Full Analytics
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
