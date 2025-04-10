"use client"

import { useState } from "react"
import { Calendar, Download, Filter, Mic, Search, SlidersHorizontal, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "../reports/date-range-picker"
import { ConversationThread } from "./conversation-thread"
import { ConversationDetail } from "./conversation-detail"

export function VoiceHistory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  })
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Mock conversation data - in a real app, this would come from an API
  const conversations = [
    {
      id: "conv-1",
      date: "Today, 10:30 AM",
      commands: [
        {
          id: "cmd-1-1",
          text: "Show my tickets",
          response: "Displaying your assigned tickets",
          status: "success",
          timestamp: "10:30 AM",
        },
        {
          id: "cmd-1-2",
          text: "Filter by high priority",
          response: "Showing high priority tickets",
          status: "success",
          timestamp: "10:31 AM",
        },
        {
          id: "cmd-1-3",
          text: "Assign ticket ABC-123 to Sarah",
          response: "Ticket ABC-123 assigned to Sarah Williams",
          status: "success",
          timestamp: "10:32 AM",
        },
      ],
    },
    {
      id: "conv-2",
      date: "Today, 9:15 AM",
      commands: [
        {
          id: "cmd-2-1",
          text: "Create a new bug in Payment System",
          response: "Please provide a title for the bug",
          status: "success",
          timestamp: "9:15 AM",
        },
        {
          id: "cmd-2-2",
          text: "Payment gateway timeout issue",
          response: "Created ticket PAY-129: Payment gateway timeout issue",
          status: "success",
          timestamp: "9:16 AM",
        },
      ],
    },
    {
      id: "conv-3",
      date: "Yesterday, 4:45 PM",
      commands: [
        {
          id: "cmd-3-1",
          text: "Show project Frontend",
          response: "Displaying Frontend project details",
          status: "success",
          timestamp: "4:45 PM",
        },
        {
          id: "cmd-3-2",
          text: "Show open tickets",
          response: "Displaying open tickets for Frontend project",
          status: "success",
          timestamp: "4:46 PM",
        },
        {
          id: "cmd-3-3",
          text: "Assign ticket FE-456 to Mike",
          response: "Sorry, I couldn't find a user named Mike",
          status: "error",
          timestamp: "4:47 PM",
        },
        {
          id: "cmd-3-4",
          text: "Assign ticket FE-456 to Mike Johnson",
          response: "Ticket FE-456 assigned to Mike Johnson",
          status: "success",
          timestamp: "4:48 PM",
        },
      ],
    },
    {
      id: "conv-4",
      date: "Yesterday, 2:30 PM",
      commands: [
        {
          id: "cmd-4-1",
          text: "Change status of ABC-124 to In Progress",
          response: "Updated ticket ABC-124 status to In Progress",
          status: "success",
          timestamp: "2:30 PM",
        },
      ],
    },
    {
      id: "conv-5",
      date: "2 days ago, 11:20 AM",
      commands: [
        {
          id: "cmd-5-1",
          text: "Go to dashboard",
          response: "Navigating to dashboard",
          status: "success",
          timestamp: "11:20 AM",
        },
        {
          id: "cmd-5-2",
          text: "Show me recent activity",
          response: "I'm not sure what you mean by recent activity",
          status: "error",
          timestamp: "11:21 AM",
        },
        {
          id: "cmd-5-3",
          text: "Show activity stream",
          response: "Displaying activity stream",
          status: "success",
          timestamp: "11:22 AM",
        },
      ],
    },
  ]

  // Filter conversations based on search query and status filter
  const filteredConversations = conversations.filter((conversation) => {
    // Search in all commands within the conversation
    const matchesSearch =
      searchQuery === "" ||
      conversation.commands.some(
        (cmd) =>
          cmd.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cmd.response.toLowerCase().includes(searchQuery.toLowerCase()),
      )

    // Filter by status
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "success" && conversation.commands.every((cmd) => cmd.status === "success")) ||
      (statusFilter === "error" && conversation.commands.some((cmd) => cmd.status === "error"))

    return matchesSearch && matchesStatus
  })

  const handleConversationSelect = (id: string) => {
    setSelectedConversation(id === selectedConversation ? null : id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Voice Conversation History</h1>
          <p className="text-muted-foreground">Review and manage your voice interactions</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Clear History
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Clear Voice History</DialogTitle>
                <DialogDescription>
                  Are you sure you want to clear your voice conversation history? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={() => setShowDeleteDialog(false)}>
                  Clear History
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Refine your conversation history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Conversations</SelectItem>
                    <SelectItem value="success">Successful Only</SelectItem>
                    <SelectItem value="error">With Errors</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Advanced Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Today</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>This Week</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>This Month</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Filter className="mr-2 h-4 w-4" />
                      <span>Command Type</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Filter className="mr-2 h-4 w-4" />
                      <span>Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="conversations">
            <TabsList>
              <TabsTrigger value="conversations">Conversations</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="conversations" className="space-y-4">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <ConversationThread
                    key={conversation.id}
                    conversation={conversation}
                    isSelected={selectedConversation === conversation.id}
                    onSelect={() => handleConversationSelect(conversation.id)}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                    <Mic className="mb-2 h-8 w-8 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No conversations found</h3>
                    <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Voice Command Analytics</CardTitle>
                  <CardDescription>Insights from your voice interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-2 text-sm font-medium">Command Success Rate</h3>
                      <div className="h-4 w-full rounded-full bg-muted">
                        <div className="h-4 rounded-full bg-green-500" style={{ width: "85%" }}></div>
                      </div>
                      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                        <span>85% Success Rate</span>
                        <span>15% Error Rate</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 text-sm font-medium">Most Used Commands</h3>
                      <ul className="space-y-2">
                        {[
                          { command: "Show my tickets", count: 24 },
                          { command: "Create a new bug", count: 18 },
                          { command: "Assign ticket to", count: 15 },
                          { command: "Change status to", count: 12 },
                          { command: "Go to dashboard", count: 10 },
                        ].map((item, index) => (
                          <li key={index} className="flex items-center justify-between">
                            <span className="text-sm">{item.command}</span>
                            <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">{item.count}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="mb-2 text-sm font-medium">Usage Over Time</h3>
                      <div className="flex h-[150px] items-end justify-between">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div
                              className="w-8 rounded-t-md bg-primary"
                              style={{
                                height: `${[60, 45, 80, 65, 90, 30, 50][index]}px`,
                              }}
                            ></div>
                            <span className="mt-1 text-xs text-muted-foreground">{day}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {selectedConversation && (
            <div className="mt-4">
              <ConversationDetail
                conversation={conversations.find((c) => c.id === selectedConversation)!}
                onClose={() => setSelectedConversation(null)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
