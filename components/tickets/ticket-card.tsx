import { AlertCircle, Bug, CheckCircle, Clock, FileText, Lightbulb } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TicketCardProps {
  id: string
  title: string
  type: string
  priority: string
  status: string
  project: string
}

export function TicketCard({ id, title, type, priority, status, project }: TicketCardProps) {
  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{id}</span>
          <PriorityBadge priority={priority} />
        </div>
        <h3 className="mt-2 line-clamp-2 text-base font-semibold">{title}</h3>
        <div className="mt-2 flex items-center space-x-2">
          <TypeBadge type={type} />
          <StatusBadge status={status} />
        </div>
      </CardContent>
      <CardFooter className="border-t p-4 pt-2">
        <span className="text-xs text-muted-foreground">{project}</span>
      </CardFooter>
    </Card>
  )
}

function TypeBadge({ type }: { type: string }) {
  const getTypeIcon = () => {
    switch (type) {
      case "bug":
        return <Bug className="h-3 w-3" />
      case "feature":
        return <Lightbulb className="h-3 w-3" />
      case "task":
      default:
        return <FileText className="h-3 w-3" />
    }
  }

  return (
    <span className="flex items-center rounded-full bg-accent px-2 py-1 text-xs font-medium">
      {getTypeIcon()}
      <span className="ml-1 capitalize">{type}</span>
    </span>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  const getPriorityColor = () => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-100 dark:bg-red-950/50 dark:text-red-300"
      case "medium":
        return "text-yellow-500 bg-yellow-100 dark:bg-yellow-950/50 dark:text-yellow-300"
      case "low":
      default:
        return "text-blue-500 bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300"
    }
  }

  return (
    <span className={cn("rounded-full px-2 py-1 text-xs font-medium", getPriorityColor())}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const getStatusInfo = () => {
    switch (status) {
      case "to-do":
        return {
          icon: <Clock className="h-3 w-3" />,
          label: "To Do",
          color: "text-blue-500 bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300",
        }
      case "in-progress":
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          label: "In Progress",
          color: "text-yellow-500 bg-yellow-100 dark:bg-yellow-950/50 dark:text-yellow-300",
        }
      case "in-review":
        return {
          icon: <FileText className="h-3 w-3" />,
          label: "In Review",
          color: "text-purple-500 bg-purple-100 dark:bg-purple-950/50 dark:text-purple-300",
        }
      case "done":
        return {
          icon: <CheckCircle className="h-3 w-3" />,
          label: "Done",
          color: "text-green-500 bg-green-100 dark:bg-green-950/50 dark:text-green-300",
        }
      default:
        return {
          icon: <Clock className="h-3 w-3" />,
          label: status,
          color: "text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-300",
        }
    }
  }

  const { icon, label, color } = getStatusInfo()

  return (
    <span className={cn("flex items-center rounded-full px-2 py-1 text-xs font-medium", color)}>
      {icon}
      <span className="ml-1">{label}</span>
    </span>
  )
}
