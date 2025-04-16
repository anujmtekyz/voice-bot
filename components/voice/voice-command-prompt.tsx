"use client"

import { useState, useEffect } from "react"
import { X, Mic, Square, Loader2, Volume2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useVoiceCommandProcessor } from "@/hooks/voice/use-voice-command-processor"
import { VoicePlayer } from "./audio/voice-player"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface VoiceCommandPromptProps {
  onClose: () => void
  wakeWord?: string
  sensitivity?: number
  voiceActivation?: boolean
}

export function VoiceCommandPrompt({
  onClose,
  wakeWord = "Hey Assistant",
  sensitivity = 0.7,
  voiceActivation = true,
}: VoiceCommandPromptProps) {
  const { toast } = useToast()
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null)
  const [audioResponse, setAudioResponse] = useState<string | null>(null)

  // Use our voice command processor hook
  const {
    isListening,
    isProcessing,
    startListening,
    stopListening,
    lastCommand,
    lastCommandResult,
    error,
  } = useVoiceCommandProcessor({
    wakeWord,
    sensitivity,
    voiceActivation,
    onWakeWordDetected: () => {
      toast({
        title: "Wake Word Detected",
        description: `Wake word "${wakeWord}" detected.`,
      })
    },
    onCommandDetected: (command) => {
      setCommandFeedback(`Processing: "${command}"`)
    },
    onCommandProcessed: (result) => {
      if (result.success) {
        setCommandFeedback(`Executed: ${result.action || "Command processed"}`)
        
        // If there's audio data in the response, play it
        if (result.data?.audioResponse) {
          setAudioResponse(result.data.audioResponse)
        }
      } else {
        // Handle error in result
        setCommandFeedback(`Failed: ${result.error || "Couldn't process command"}`)
      }
    },
    onError: (errorMessage) => {
      // Display error toast for critical errors
      toast({
        title: "Voice Command Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  })

  // Automatically start listening when the component mounts
  useEffect(() => {
    startListening()
    
    // Clean up when the component unmounts
    return () => {
      stopListening()
    }
  }, [startListening, stopListening])

  // Handle toggle listening
  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      setCommandFeedback(null)
      startListening()
    }
  }

  // Handle close
  const handleClose = () => {
    stopListening()
    onClose()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Voice Command</h3>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      <div className="rounded-md bg-accent p-3">
        <div className="flex items-center space-x-2">
          <div className={`relative h-3 w-3 ${isListening ? "animate-pulse" : ""}`}>
            <span
              className={`absolute inline-flex h-full w-full rounded-full ${
                isListening ? "bg-red-400" : isProcessing ? "bg-yellow-400" : "bg-muted-foreground"
              }`}
            ></span>
          </div>
          <p className="text-sm font-medium">
            {isListening
              ? "Listening..."
              : isProcessing
              ? "Processing..."
              : "Ready for command"}
          </p>
          
          <div className="flex-1"></div>
          
          <Button 
            variant={isListening ? "destructive" : "default"}
            size="sm"
            className="h-8 w-8 rounded-full p-0"
            onClick={toggleListening}
          >
            {isListening ? (
              <Square className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
            <span className="sr-only">
              {isListening ? "Stop listening" : "Start listening"}
            </span>
          </Button>
        </div>

        <div className="mt-2 min-h-[60px] rounded-md border bg-background p-2">
          {isProcessing ? (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span className="text-sm">Processing your request...</span>
            </div>
          ) : commandFeedback ? (
            <div>
              <p className="text-sm font-medium">Command: {lastCommand}</p>
              <p className="text-sm text-muted-foreground">{commandFeedback}</p>
            </div>
          ) : (
            <p className="text-sm">
              {isListening
                ? "Speak now..."
                : "Press the microphone button to start"}
            </p>
          )}
        </div>
      </div>
      
      {audioResponse && (
        <div className="mt-2">
          <VoicePlayer 
            audioData={audioResponse} 
            autoPlay={true}
            onPlaybackComplete={() => setAudioResponse(null)}
          />
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        <p>Try saying: "{wakeWord}, show my tickets", or "{wakeWord}, what time is it?"</p>
      </div>
    </div>
  )
}

