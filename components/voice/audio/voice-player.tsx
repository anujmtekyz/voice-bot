"use client";

import { useEffect } from "react";
import { Play, Pause, Volume2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useVoicePlayer } from "@/hooks/voice/use-voice-player";

interface VoicePlayerProps {
  audioData?: string;
  autoPlay?: boolean;
  className?: string;
  onPlaybackComplete?: () => void;
}

/**
 * Voice player component for playing audio from base64 data
 */
export function VoicePlayer({
  audioData,
  autoPlay = false,
  className = "",
  onPlaybackComplete,
}: VoicePlayerProps) {
  const {
    isPlaying,
    isLoading,
    progress,
    duration,
    play,
    pause,
    togglePlayPause,
    setAudioSource,
    seek,
  } = useVoicePlayer();

  // Format time in MM:SS format
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Set audio source when audioData changes
  useEffect(() => {
    if (audioData) {
      setAudioSource(audioData);
      if (autoPlay) {
        // Small delay to ensure audio is loaded
        setTimeout(() => {
          play();
        }, 100);
      }
    }
  }, [audioData, setAudioSource, play]);

  // Call completion handler when audio finishes
  useEffect(() => {
    if (!isPlaying && progress > 0 && progress >= duration && onPlaybackComplete) {
      onPlaybackComplete();
    }
  }, [isPlaying, progress, duration, onPlaybackComplete]);

  // Don't render if no audio data is provided
  if (!audioData) {
    return null;
  }

  return (
    <Card className={`w-full overflow-hidden ${className}`}>
      <CardContent className="p-3">
        <div className="flex items-center space-x-2">
          <Button
            onClick={togglePlayPause}
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-full p-0"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            <span className="sr-only">
              {isPlaying ? "Pause" : "Play"} voice audio
            </span>
          </Button>

          <div className="flex flex-1 items-center space-x-2">
            <Slider
              value={[progress]}
              max={duration || 100}
              step={0.1}
              className="h-1"
              onValueChange={(values) => {
                if (values[0] !== progress) {
                  seek(values[0]);
                }
              }}
              disabled={isLoading || duration === 0}
            />
          </div>

          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>{formatTime(progress)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>

          <Volume2 className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}