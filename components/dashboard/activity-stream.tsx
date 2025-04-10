import { MessageSquare, UserPlus, CheckCircle, AlertCircle, Edit } from "lucide-react"

export function ActivityStream() {
  const activities = [
    {
      id: 1,
      type: "comment",
      user: "Jane Smith",
      ticket: "ABC-123",
      time: "10 minutes ago",
      icon: <MessageSquare className="h-4 w-4" />,
      description: "Added a comment on",
    },
    {
      id: 2,
      type: "assignment",
      user: "Mike Johnson",
      ticket: "ABC-124",
      time: "1 hour ago",
      icon: <UserPlus className="h-4 w-4" />,
      description: "Assigned",
      target: "to you",
    },
    {
      id: 3,
      type: "status",
      user: "You",
      ticket: "ABC-125",
      time: "2 hours ago",
      icon: <CheckCircle className="h-4 w-4" />,
      description: "Changed status to In Progress on",
    },
    {
      id: 4,
      type: "priority",
      user: "Sarah Williams",
      ticket: "ABC-126",
      time: "Yesterday",
      icon: <AlertCircle className="h-4 w-4" />,
      description: "Changed priority to High on",
    },
    {
      id: 5,
      type: "edit",
      user: "You",
      ticket: "ABC-127",
      time: "Yesterday",
      icon: <Edit className="h-4 w-4" />,
      description: "Updated description on",
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <div className="rounded-full bg-gray-100 p-1">{activity.icon}</div>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">{activity.user}</span> {activity.description}{" "}
              <span className="font-medium">{activity.ticket}</span>
              {activity.target && <span>{activity.target}</span>}
            </p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
