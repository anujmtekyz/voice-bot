import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function VoiceCommandGuide() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Voice Command Guide</h1>
        <p className="text-muted-foreground">Learn how to use voice commands with JIRA Voicebot</p>
      </div>

      <Tabs defaultValue="navigation">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="navigation" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Navigation Commands</CardTitle>
              <CardDescription>Commands to navigate around the application</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {[
                  { command: "Go to dashboard", description: "Navigate to the main dashboard" },
                  { command: "Show my tickets", description: "Navigate to your assigned tickets" },
                  { command: "Open projects", description: "Navigate to the projects page" },
                  { command: "Go to settings", description: "Navigate to settings page" },
                  { command: "Go back", description: "Navigate to the previous page" },
                ].map((item, index) => (
                  <li key={index} className="grid grid-cols-2 gap-4">
                    <div className="font-medium">{item.command}</div>
                    <div className="text-muted-foreground">{item.description}</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Commands</CardTitle>
              <CardDescription>Commands for working with tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {[
                  { command: "Create a new bug", description: "Start the bug creation process" },
                  { command: "Create a new task", description: "Start the task creation process" },
                  { command: "Show ticket ABC-123", description: "Open a specific ticket" },
                  { command: "Assign this ticket to [name]", description: "Assign the current ticket" },
                  { command: "Change status to [status]", description: "Update ticket status" },
                  { command: "Add a comment", description: "Add a comment to the current ticket" },
                ].map((item, index) => (
                  <li key={index} className="grid grid-cols-2 gap-4">
                    <div className="font-medium">{item.command}</div>
                    <div className="text-muted-foreground">{item.description}</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Commands</CardTitle>
              <CardDescription>Commands for working with projects</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {[
                  { command: "Show project [name]", description: "Open a specific project" },
                  { command: "Show all projects", description: "List all available projects" },
                  { command: "Show bugs in [project]", description: "Filter bugs in a project" },
                  { command: "Show open tickets in [project]", description: "Show open tickets in a project" },
                ].map((item, index) => (
                  <li key={index} className="grid grid-cols-2 gap-4">
                    <div className="font-medium">{item.command}</div>
                    <div className="text-muted-foreground">{item.description}</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Commands</CardTitle>
              <CardDescription>More complex voice interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {[
                  { command: "Find all high priority bugs", description: "Search for high priority bugs" },
                  { command: "Show tickets updated in the last week", description: "Filter by recent updates" },
                  { command: "Create a bug in [project] about [issue]", description: "Create a specific bug" },
                  { command: "Generate a report of [type]", description: "Create a specific report" },
                ].map((item, index) => (
                  <li key={index} className="grid grid-cols-2 gap-4">
                    <div className="font-medium">{item.command}</div>
                    <div className="text-muted-foreground">{item.description}</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
