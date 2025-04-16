"use client";

import { useState } from "react";
import { Mic, Square, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useVoiceRecorder } from "@/hooks/voice/use-voice-recorder";
import { VoicePlayer } from "./voice-player";

interface VoiceRecorderProps {
  onRecordingComplete?: (audioData: string) => void;
  className?: string;
}

/**
 * Voice recorder component
 */
export function VoiceRecorder({
  onRecordingComplete,
  className = "",
}: VoiceRecorderProps) {
  const [submitted, setSubmitted] = useState(false);
  
  const {
    isRecording,
    recordingTime,
    audioBase64,
    isProcessing,
    startRecording,
    stopRecording,
    resetRecording,
    hasRecording,
  } = useVoiceRecorder();

  // Format recording time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle submission of recording
  const handleSubmit = () => {
    if (audioBase64 && onRecordingComplete) {
      onRecordingComplete(audioBase64);
      setSubmitted(true);
    }
  };

  // Reset recording state
  const handleReset = () => {
    resetRecording();
    setSubmitted(false);
  };

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isRecording ? (
                <>
                  <div className="h-3 w-3 animate-pulse rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium">
                    Recording... {formatTime(recordingTime)}
                  </span>
                </>
              ) : hasRecording ? (
                <span className="text-sm font-medium">Recording ready</span>
              ) : (
                <span className="text-sm font-medium">Record voice message</span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {!isRecording && hasRecording && !submitted && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleReset}
                  disabled={isProcessing}
                >
                  <RotateCcw className="mr-1 h-3 w-3" />
                  Reset
                </Button>
              )}
              
              {!isRecording && hasRecording && !submitted && (
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleSubmit}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              )}
            </div>
          </div>

          {hasRecording && audioBase64 && (
            <VoicePlayer audioData={audioBase64} className="mt-2" />
          )}

          {!hasRecording && (
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
              size="icon"
              className="mx-auto h-12 w-12 rounded-full"
              disabled={isProcessing || submitted}
            >
              {isProcessing ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : isRecording ? (
                <Square className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
              <span className="sr-only">
                {isRecording ? "Stop recording" : "Start recording"}
              </span>
            </Button>
          )}

          {submitted && (
            <div className="mt-2 text-center text-sm text-muted-foreground">
              Recording submitted
              <Button 
                variant="link" 
                size="sm"
                className="ml-2 h-auto p-0"
                onClick={handleReset}
              >
                Record again
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 