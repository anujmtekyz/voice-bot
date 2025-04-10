import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Briefcase, Ticket, User } from "lucide-react"

interface ProjectCardProps {
  name: string
  description: string
  ticketCount: number
  openTickets: number
  lead: string
}

export function ProjectCard({ name, description, ticketCount, openTickets, lead }: ProjectCardProps) {
  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2">
          <Briefcase className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">{name}</h3>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{description}</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-1 text-sm">
            <Ticket className="h-4 w-4 text-muted-foreground" />
            <span>{ticketCount} tickets</span>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
            <span>{openTickets} open</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t p-4 pt-2">
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span>Lead: {lead}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
