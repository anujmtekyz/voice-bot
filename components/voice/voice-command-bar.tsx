"use client"

import { useState, useEffect } from "react"
import { Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { VoiceCommandPrompt } from "./voice-command-prompt"
import { useToast } from "@/hooks/use-toast"
import { voiceApi } from "@/lib/api"

export function VoiceCommandBar() {
  const { toast } = useToast()
  const [expanded, setExpanded] = useState(false)
  const [settings, setSettings] = useState({
    voiceActivation: true,
    wakeWord: "Hey Assistant",
    sensitivity: 0.7,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch voice settings when the component mounts
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await voiceApi.getSettings()
        if (response.success && response.data) {
          setSettings({
            voiceActivation: response.data.voiceActivation,
            wakeWord: response.data.wakeWord,
            sensitivity: response.data.sensitivity,
          })
          setError(null)
        }
      } catch (error) {
        console.error('Failed to fetch voice settings:', error)
        // Don't show an error toast here as it's not critical for the UI
        // Just silently use the default settings
        setError("Using default voice settings")
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const toggleVoiceCommand = () => {
    setExpanded(!expanded)
    
    if (!expanded && error) {
      // If we're opening the prompt and had an error, notify the user once about using defaults
      toast({
        title: "Using Default Settings",
        description: "Voice settings could not be loaded. Using default settings instead.",
      })
    }
  }

  const handleClose = () => {
    setExpanded(false)
  }

  // Don't render anything while loading
  if (loading) {
    return null
  }

  // Don't render if voice activation is disabled, but only after loading is done
  if (!settings.voiceActivation) {
    return null
  }

  return (
    <div className="fixed bottom-16 right-4 z-50 md:bottom-4">
      <div className="flex flex-col items-end space-y-2">
        {expanded && (
          <Card className="w-full max-w-md rounded-lg p-4 shadow-lg md:w-96">
            <VoiceCommandPrompt 
              onClose={handleClose}
              wakeWord={settings.wakeWord}
              sensitivity={settings.sensitivity}
              voiceActivation={settings.voiceActivation}
            />
          </Card>
        )}

        <Button
          onClick={toggleVoiceCommand}
          size="icon"
          variant={expanded ? "destructive" : "default"}
          className="h-12 w-12 rounded-full shadow-md"
        >
          {expanded ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          <span className="sr-only">{expanded ? "Close voice command" : "Open voice command"}</span>
        </Button>
      </div>
    </div>
  )
}
