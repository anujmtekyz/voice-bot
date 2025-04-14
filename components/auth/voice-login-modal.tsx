"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { VoiceService } from "@/services/voice"

// TypeScript declarations for Web Speech API
interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string
      }
    }
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  onstart: () => void
  onend: () => void
  onerror: (event: SpeechRecognitionErrorEvent) => void
  onresult: (event: SpeechRecognitionEvent) => void
}

interface Window {
  SpeechRecognition: {
    new(): SpeechRecognition
  }
  webkitSpeechRecognition: {
    new(): SpeechRecognition
  }
}

interface VoiceLoginModalProps {
  isOpen: boolean
  onClose: () => void
  onVoiceInput: (email: string, password: string) => void
}

export function VoiceLoginModal({ isOpen, onClose, onVoiceInput }: VoiceLoginModalProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])
  const voiceService = VoiceService.getInstance()

  useEffect(() => {
    let stream: MediaStream | null = null;

    const initializeMediaRecorder = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaRecorder.current = new MediaRecorder(stream)

        mediaRecorder.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.current.push(event.data)
          }
        }

        mediaRecorder.current.onstop = async () => {
          setIsProcessing(true)
          try {
            const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' })
            const base64Audio = await voiceService.convertAudioToBase64(audioBlob)
            const transcribedText = await voiceService.transcribeAudio(base64Audio, 'webm')
            setTranscript(transcribedText)
            processVoiceInput(transcribedText)
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to process audio')
          } finally {
            setIsProcessing(false)
            audioChunks.current = []
          }
        }
      } catch (err) {
        setError('Microphone access denied or not available')
      }
    }

    if (isOpen) {
      initializeMediaRecorder()
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      if (mediaRecorder.current) {
        if (mediaRecorder.current.state === 'recording') {
          mediaRecorder.current.stop()
        }
        mediaRecorder.current = null
      }
      audioChunks.current = []
    }
  }, [isOpen])

  const processVoiceInput = (input: string) => {
    const emailMatch = input.match(/email is ([\w\.-]+@[\w\.-]+\.\w+)/i)
    const passwordMatch = input.match(/password is (\w+)/i)

    if (emailMatch && passwordMatch) {
      const email = emailMatch[1]
      const password = passwordMatch[1]
      onVoiceInput(email, password)
      stopListening()
    }
  }

  const startListening = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'inactive') {
      setError(null)
      setTranscript("")
      audioChunks.current = []
      mediaRecorder.current.start()
      setIsListening(true)
    }
  }

  const stopListening = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop()
      setIsListening(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Voice Login</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Please say your email and password in the format:
              <br />
              "Email is example@email.com, password is yourpassword"
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <Button
              onClick={isListening ? stopListening : startListening}
              variant={isListening ? "destructive" : "default"}
              className="h-16 w-16 rounded-full"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : isListening ? (
                <MicOff className="h-8 w-8" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </Button>
            <p className="text-sm font-medium">
              {isProcessing ? "Processing..." : isListening ? "Listening..." : "Click to start"}
            </p>
          </div>

          {transcript && (
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm">{transcript}</p>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-destructive">
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 