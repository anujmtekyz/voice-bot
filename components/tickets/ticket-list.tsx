"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpDown, Filter, Plus, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TicketCard } from "./ticket-card"
import { CreateTicketDialog } from "./create-ticket-dialog"

export function TicketList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null)
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
    {
      id: "ABC-126",
      title: "Update documentation for API v2",
      type: "task",
      priority: "low",
      status: "in-review",
      project: "Documentation",
    },
    {
      id: "ABC-127",
      title: "Implement dark mode toggle",
      type: "feature",
      priority: "medium",
      status: "to-do",
      project: "Frontend",
    },
    {
      id: "ABC-128",
      title: "Database performance optimization",
      type: "task",
      priority: "high",
      status: "in-progress",
      project: "Backend",
    },
  ])

  const handleTicketCreated = (ticketData: any) => {
    // Generate a mock ID for the new ticket
    const newId = `ABC-${129 + tickets.length - 6}`

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

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter ? ticket.status === statusFilter : true
    const matchesPriority = priorityFilter ? ticket.priority === priorityFilter : true

    return matchesSearch && matchesStatus && matchesPriority
  })

  const clearFilters = () => {
    setStatusFilter(null)
    setPriorityFilter(null)
  }

  // Create ticket dialog reference
  const [createTicketDialogOpen, setCreateTicketDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tickets</h1>
          <p className="text-muted-foreground">Manage and track your tickets</p>
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

      <Card>
        <CardHeader>
          <CardTitle>All Tickets</CardTitle>
          <CardDescription>
            {filteredTickets.length} tickets found
            {(statusFilter || priorityFilter) && (
              <>
                {" "}
                with filters
                <Button variant="link" className="h-auto p-0" onClick={clearFilters}>
                  Clear filters
                </Button>
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Status
                    {statusFilter && (
                      <span className="ml-1 rounded-full bg-primary/20 px-1 text-xs">{statusFilter}</span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setStatusFilter("to-do")}>To Do</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("in-progress")}>In Progress</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("in-review")}>In Review</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("done")}>Done</DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Priority
                    {priorityFilter && (
                      <span className="ml-1 rounded-full bg-primary/20 px-1 text-xs">{priorityFilter}</span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setPriorityFilter("high")}>High</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPriorityFilter("medium")}>Medium</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPriorityFilter("low")}>Low</DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
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
    </div>
  )
}
