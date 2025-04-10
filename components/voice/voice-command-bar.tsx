"use client"

import { useState } from "react"
import { Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { VoiceCommandPrompt } from "./voice-command-prompt"
import { useVoiceRecognition } from "@/hooks/use-voice-recognition"

export function VoiceCommandBar() {
  const [expanded, setExpanded] = useState(false)
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useVoiceRecognition()

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      setExpanded(true)
      startListening()
    }
  }

  const handleClose = () => {
    if (isListening) {
      stopListening()
    }
    setExpanded(false)
    resetTranscript()
  }

  return (
    <div className="fixed bottom-16 right-4 z-50 md:bottom-4">
      <div className="flex flex-col items-end space-y-2">
        {expanded && (
          <Card className="w-full max-w-md rounded-lg p-4 shadow-lg md:w-96">
            <VoiceCommandPrompt isListening={isListening} transcript={transcript} onClose={handleClose} />
          </Card>
        )}

        <Button
          onClick={toggleListening}
          size="icon"
          variant={isListening ? "destructive" : "default"}
          className="h-12 w-12 rounded-full shadow-md"
        >
          {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          <span className="sr-only">{isListening ? "Stop listening" : "Start voice command"}</span>
        </Button>
      </div>
    </div>
  )
}
