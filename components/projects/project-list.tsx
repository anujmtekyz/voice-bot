"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProjectCard } from "./project-card"

export function ProjectList() {
  const [searchQuery, setSearchQuery] = useState("")

  const projects = [
    {
      id: "payment-system",
      name: "Payment System",
      description: "Payment processing and gateway integration",
      ticketCount: 24,
      openTickets: 8,
      lead: "John Doe",
    },
    {
      id: "user-management",
      name: "User Management",
      description: "User authentication and profile management",
      ticketCount: 18,
      openTickets: 5,
      lead: "Jane Smith",
    },
    {
      id: "frontend",
      name: "Frontend",
      description: "User interface and experience",
      ticketCount: 32,
      openTickets: 12,
      lead: "Mike Johnson",
    },
    {
      id: "backend",
      name: "Backend",
      description: "API and database services",
      ticketCount: 29,
      openTickets: 7,
      lead: "Sarah Williams",
    },
    {
      id: "documentation",
      name: "Documentation",
      description: "User guides and API documentation",
      ticketCount: 15,
      openTickets: 3,
      lead: "David Brown",
    },
  ]

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage and track your projects</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
          <CardDescription>{filteredProjects.length} projects found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <ProjectCard
                  name={project.name}
                  description={project.description}
                  ticketCount={project.ticketCount}
                  openTickets={project.openTickets}
                  lead={project.lead}
                />
              </Link>
            ))}

            {filteredProjects.length === 0 && (
              <div className="col-span-full py-8 text-center">
                <p className="text-muted-foreground">No projects found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
