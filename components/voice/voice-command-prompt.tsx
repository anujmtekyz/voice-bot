"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VoiceCommandPromptProps {
  isListening: boolean
  transcript: string
  onClose: () => void
}

export function VoiceCommandPrompt({ isListening, transcript, onClose }: VoiceCommandPromptProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Voice Command</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      <div className="rounded-md bg-accent p-3">
        <div className="flex items-center space-x-2">
          <div className={`relative h-3 w-3 ${isListening ? "animate-pulse" : ""}`}>
            <span
              className={`absolute inline-flex h-full w-full rounded-full ${isListening ? "bg-red-400" : "bg-muted-foreground"}`}
            ></span>
          </div>
          <p className="text-sm font-medium">{isListening ? "Listening..." : "Ready for command"}</p>
        </div>

        <div className="mt-2 min-h-[60px] rounded-md border bg-background p-2">
          <p className="text-sm">
            {transcript || (isListening ? "Speak now..." : "Press the microphone button to start")}
          </p>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        <p>Try saying: "Show my tickets", "Create a new bug", or "Go to dashboard"</p>
      </div>
    </div>
  )
}
