"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { userApi } from "@/lib/auth-api"
import { Loader2 } from "lucide-react"

export function UserProfile() {
  const { user, refreshUserProfile } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    jiraEmail: "",
    jiraServerUrl: "",
    bio: "",
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
  })

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        role: user.role || "",
        jiraEmail: user.jiraEmail || "",
        jiraServerUrl: user.jiraServerUrl || "",
        bio: "",  // Not in user profile model but kept for UI
        timezone: "America/New_York", // Default
        language: "en", // Default
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
      })
    }
  }, [user])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      // Only send fields that are editable by the user
      await userApi.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        jiraEmail: formData.jiraEmail,
        jiraServerUrl: formData.jiraServerUrl
      })
      
      // Refresh the user profile in auth context
      await refreshUserProfile()
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully",
      })
      
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast({
        title: "Update failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!user) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading profile...</span>
      </div>
    )
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
                <Button 
                  variant={isEditing ? "default" : "outline"} 
                  onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                  disabled={isSaving}
                >
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditing 
                    ? (isSaving ? "Saving..." : "Save Changes") 
                    : "Edit Profile"
                  }
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={formData.firstName} 
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      disabled={!isEditing || isSaving} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={formData.lastName} 
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      disabled={!isEditing || isSaving} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Cannot be changed)</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email} 
                      disabled={true} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role (Assigned by admin)</Label>
                    <Input 
                      id="role" 
                      value={formData.role} 
                      disabled={true} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    value={formData.bio} 
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    disabled={!isEditing || isSaving} 
                    className="min-h-[100px]" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>JIRA Integration</CardTitle>
              <CardDescription>Connect your JIRA account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="jiraEmail">JIRA Email</Label>
                    <Input 
                      id="jiraEmail" 
                      value={formData.jiraEmail} 
                      onChange={(e) => handleInputChange("jiraEmail", e.target.value)}
                      disabled={!isEditing || isSaving} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jiraServerUrl">JIRA Server URL</Label>
                    <Input 
                      id="jiraServerUrl" 
                      value={formData.jiraServerUrl} 
                      onChange={(e) => handleInputChange("jiraServerUrl", e.target.value)}
                      disabled={!isEditing || isSaving} 
                      placeholder="https://your-domain.atlassian.net"
                    />
                  </div>
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
                    <Select 
                      value={formData.timezone} 
                      onValueChange={(value) => handleInputChange("timezone", value)} 
                      disabled={!isEditing || isSaving}
                    >
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
                    <Select 
                      value={formData.language} 
                      onValueChange={(value) => handleInputChange("language", value)} 
                      disabled={!isEditing || isSaving}
                    >
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
                      <Switch id="email-notifications" checked={formData.notifications.email} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="browser-notifications">Browser Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive notifications in your browser</p>
                      </div>
                      <Switch id="browser-notifications" checked={formData.notifications.browser} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="mobile-notifications">Mobile Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive notifications on your mobile device</p>
                      </div>
                      <Switch id="mobile-notifications" checked={formData.notifications.mobile} />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-4 text-sm font-medium">Notification Events</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ticket-assigned">Ticket assigned to you</Label>
                      <Switch id="ticket-assigned" checked={formData.notifications.ticketAssigned} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ticket-updated">Ticket updated</Label>
                      <Switch id="ticket-updated" checked={formData.notifications.ticketUpdated} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="comment-added">Comment added</Label>
                      <Switch id="comment-added" checked={formData.notifications.commentAdded} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="mentioned">Mentioned in comment</Label>
                      <Switch id="mentioned" checked={formData.notifications.mentionedInComment} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="status-changed">Status changed</Label>
                      <Switch id="status-changed" checked={formData.notifications.statusChanged} />
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
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium">"{item.command}"</p>
                        <p className="text-sm text-muted-foreground">{item.timestamp}</p>
                      </div>
                      <div className="flex items-center mt-2 sm:mt-0">
                        <span
                          className={`mr-2 h-2 w-2 rounded-full ${
                            item.success ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        <span className={`text-sm ${item.success ? "text-green-500" : "text-red-500"}`}>
                          {item.success ? "Success" : "Failed"}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm">{item.response}</p>
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

