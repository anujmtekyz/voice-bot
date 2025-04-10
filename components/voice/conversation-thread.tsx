"use client"

import { ChevronDown, ChevronRight, Mic } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Command {
  id: string
  text: string
  response: string
  status: "success" | "error"
  timestamp: string
}

interface Conversation {
  id: string
  date: string
  commands: Command[]
}

interface ConversationThreadProps {
  conversation: Conversation
  isSelected: boolean
  onSelect: () => void
}

export function ConversationThread({ conversation, isSelected, onSelect }: ConversationThreadProps) {
  // Calculate success rate for this conversation
  const successCount = conversation.commands.filter((cmd) => cmd.status === "success").length
  const successRate = Math.round((successCount / conversation.commands.length) * 100)

  // Get the first few commands to preview
  const previewCommands = conversation.commands.slice(0, 2)
  const hasMoreCommands = conversation.commands.length > 2

  return (
    <Card className={cn("transition-all hover:shadow-md", isSelected && "border-primary")}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Mic className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{conversation.date}</h3>
              <p className="text-xs text-muted-foreground">
                {conversation.commands.length} command{conversation.commands.length !== 1 ? "s" : ""} • {successRate}%
                success rate
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onSelect}>
            {isSelected ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        {!isSelected && (
          <div className="mt-2 space-y-2">
            {previewCommands.map((command) => (
              <div key={command.id} className="rounded-md bg-muted/50 p-2 text-sm">
                <p className="font-medium">{command.text}</p>
                <p
                  className={cn(
                    "text-xs",
                    command.status === "success"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400",
                  )}
                >
                  {command.status === "success" ? "✓ " : "✗ "}
                  {command.response}
                </p>
              </div>
            ))}
            {hasMoreCommands && (
              <p className="text-center text-xs text-muted-foreground">
                +{conversation.commands.length - 2} more commands
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
