"use client"

import React, { useState, useLayoutEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "./date-range-picker"
import { TicketStatusChart } from "./ticket-status-chart"
import { TicketPriorityChart } from "./ticket-priority-chart"
import { TicketTrendChart } from "./ticket-trend-chart"
import { TeamPerformanceChart } from "./team-performance-chart"
import { ProjectCompletionChart } from "./project-completion-chart"
import { VoiceCommandUsageChart } from "./voice-command-usage-chart"
import { ReportMetrics } from "./report-metrics"

export function Reports() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  })

  const [projectFilter, setProjectFilter] = useState<string>("all")

  const [isStable, setIsStable] = useState(false)

  useLayoutEffect(() => {
    // Set a small timeout to ensure the layout is stable before rendering charts
    const timer = setTimeout(() => {
      setIsStable(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Modify the return statement to conditionally render content
  // Wrap the content in a fragment with a key to force a clean remount
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Visualize and analyze your team's performance</p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="payment-system">Payment System</SelectItem>
              <SelectItem value="user-management">User Management</SelectItem>
              <SelectItem value="frontend">Frontend</SelectItem>
              <SelectItem value="backend">Backend</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      {isStable ? (
        <React.Fragment key="stable-content">
          <ReportMetrics dateRange={dateRange} projectFilter={projectFilter} />

          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tickets">Tickets</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="voice">Voice Usage</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Ticket Trend</CardTitle>
                    <CardDescription>Number of tickets created and resolved over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TicketTrendChart dateRange={dateRange} projectFilter={projectFilter} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ticket Status Distribution</CardTitle>
                    <CardDescription>Current tickets by status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TicketStatusChart projectFilter={projectFilter} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ticket Priority</CardTitle>
                    <CardDescription>Current tickets by priority</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TicketPriorityChart projectFilter={projectFilter} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tickets" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Ticket Resolution Time</CardTitle>
                    <CardDescription>Average time to resolve tickets by priority</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <div className="flex h-full items-center justify-center">
                      <p className="text-muted-foreground">Detailed ticket resolution metrics will appear here</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ticket Types</CardTitle>
                    <CardDescription>Distribution of ticket types</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <div className="flex h-full items-center justify-center">
                      <p className="text-muted-foreground">Ticket type distribution chart will appear here</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ticket Aging</CardTitle>
                    <CardDescription>Age of open tickets</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <div className="flex h-full items-center justify-center">
                      <p className="text-muted-foreground">Ticket aging chart will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Project Completion</CardTitle>
                    <CardDescription>Progress of active projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProjectCompletionChart />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Project Health</CardTitle>
                    <CardDescription>Overall health status of projects</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <div className="flex h-full items-center justify-center">
                      <p className="text-muted-foreground">Project health metrics will appear here</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Project Timeline</CardTitle>
                    <CardDescription>Timeline and milestone tracking</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <div className="flex h-full items-center justify-center">
                      <p className="text-muted-foreground">Project timeline chart will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="team" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Team Performance</CardTitle>
                    <CardDescription>Tickets resolved by team member</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TeamPerformanceChart dateRange={dateRange} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Workload Distribution</CardTitle>
                    <CardDescription>Current workload by team member</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <div className="flex h-full items-center justify-center">
                      <p className="text-muted-foreground">Workload distribution chart will appear here</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Response Time</CardTitle>
                    <CardDescription>Average response time by team member</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <div className="flex h-full items-center justify-center">
                      <p className="text-muted-foreground">Response time metrics will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="voice" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Voice Command Usage</CardTitle>
                    <CardDescription>Most frequently used voice commands</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <VoiceCommandUsageChart dateRange={dateRange} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Voice Command Success Rate</CardTitle>
                    <CardDescription>Percentage of successfully executed commands</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <div className="flex h-full items-center justify-center">
                      <p className="text-muted-foreground">Voice command success metrics will appear here</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Voice Command Trends</CardTitle>
                    <CardDescription>Usage patterns over time</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <div className="flex h-full items-center justify-center">
                      <p className="text-muted-foreground">Voice command trend chart will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Reports</CardTitle>
                  <CardDescription>Create and save custom reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex h-[400px] flex-col items-center justify-center space-y-4">
                    <p className="text-center text-muted-foreground">
                      You can create custom reports with specific metrics and visualizations
                    </p>
                    <Button>Create New Report</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </React.Fragment>
      ) : (
        // Show a simple loading state while layout stabilizes
        <div className="py-8 text-center">
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      )}
    </div>
  )
}
