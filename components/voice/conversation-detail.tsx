"use client"

import { X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

interface ConversationDetailProps {
  conversation: Conversation
  onClose: () => void
}

export function ConversationDetail({ conversation, onClose }: ConversationDetailProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Conversation Detail</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{conversation.date}</h3>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>

          <div className="space-y-4">
            {conversation.commands.map((command, index) => (
              <div key={command.id} className="space-y-2">
                <div className="flex items-start space-x-2">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-xs font-bold text-primary">You</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Voice Command</p>
                      <span className="text-xs text-muted-foreground">{command.timestamp}</span>
                    </div>
                    <div className="rounded-md bg-muted/50 p-3">
                      <p>{command.text}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                    <span className="text-xs font-bold">Bot</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Response</p>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          command.status === "success"
                            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
                        )}
                      >
                        {command.status === "success" ? "Success" : "Error"}
                      </span>
                    </div>
                    <div className="rounded-md bg-background p-3 shadow-sm">
                      <p>{command.response}</p>
                    </div>
                  </div>
                </div>

                {index < conversation.commands.length - 1 && (
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t"></span>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-card px-2 text-xs text-muted-foreground">
                        {index < conversation.commands.length - 1 ? "Continued" : "End of conversation"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
