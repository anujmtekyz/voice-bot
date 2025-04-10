"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false)

  // Mock user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Developer",
    department: "Engineering",
    bio: "Full-stack developer with 5 years of experience in web applications and distributed systems.",
    timezone: "America/New_York",
    language: "en",
    notifications: {
      email: true,
      browser: true,
      mobile: false,
      ticketAssigned: true,
      ticketUpdated: true,
      commentAdded: true,
      mentionedInComment: true,
      statusChanged: false,
    },
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="voice-history">Voice History</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </div>
                <Button variant={isEditing ? "default" : "outline"} onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user.name} disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user.email} disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue={user.role} disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" defaultValue={user.department} disabled={!isEditing} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" defaultValue={user.bio} disabled={!isEditing} className="min-h-[100px]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue={user.timezone} disabled={!isEditing}>
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue={user.language} disabled={!isEditing}>
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 text-sm font-medium">Notification Channels</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch id="email-notifications" defaultChecked={user.notifications.email} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="browser-notifications">Browser Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive notifications in your browser</p>
                      </div>
                      <Switch id="browser-notifications" defaultChecked={user.notifications.browser} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="mobile-notifications">Mobile Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive notifications on your mobile device</p>
                      </div>
                      <Switch id="mobile-notifications" defaultChecked={user.notifications.mobile} />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-4 text-sm font-medium">Notification Events</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ticket-assigned">Ticket assigned to you</Label>
                      <Switch id="ticket-assigned" defaultChecked={user.notifications.ticketAssigned} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ticket-updated">Ticket updated</Label>
                      <Switch id="ticket-updated" defaultChecked={user.notifications.ticketUpdated} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="comment-added">Comment added</Label>
                      <Switch id="comment-added" defaultChecked={user.notifications.commentAdded} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="mentioned">Mentioned in comment</Label>
                      <Switch id="mentioned" defaultChecked={user.notifications.mentionedInComment} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="status-changed">Status changed</Label>
                      <Switch id="status-changed" defaultChecked={user.notifications.statusChanged} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice-history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Voice Command History</CardTitle>
              <CardDescription>Review your recent voice interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    command: "Show my tickets",
                    timestamp: "Today, 10:30 AM",
                    success: true,
                    response: "Displaying your assigned tickets",
                  },
                  {
                    id: 2,
                    command: "Create a new bug in Payment System",
                    timestamp: "Today, 9:15 AM",
                    success: true,
                    response: "Created ticket PAY-129",
                  },
                  {
                    id: 3,
                    command: "Assign ticket to Sarah",
                    timestamp: "Yesterday, 4:45 PM",
                    success: false,
                    response: "Could not find user 'Sarah'",
                  },
                  {
                    id: 4,
                    command: "Change status to In Progress",
                    timestamp: "Yesterday, 2:30 PM",
                    success: true,
                    response: "Updated ticket status to In Progress",
                  },
                  {
                    id: 5,
                    command: "Go to dashboard",
                    timestamp: "Yesterday, 11:20 AM",
                    success: true,
                    response: "Navigating to dashboard",
                  },
                ].map((item) => (
                  <div key={item.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{item.command}</p>
                        <p className="text-sm text-muted-foreground">{item.timestamp}</p>
                      </div>
                      <div
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          item.success ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                        }`}
                      >
                        {item.success ? "Success" : "Failed"}
                      </div>
                    </div>
                    <div className="mt-2 rounded-md bg-gray-50 p-2 text-sm">
                      <p>Response: {item.response}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
