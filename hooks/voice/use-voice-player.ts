import { useState, useEffect, useRef } from "react";

interface UseVoicePlayerReturn {
  isPlaying: boolean;
  isLoading: boolean;
  progress: number;
  duration: number;
  play: () => void;
  pause: () => void;
  stop: () => void;
  togglePlayPause: () => void;
  setAudioSource: (source: string, type?: string) => void;
  seek: (time: number) => void;
}

/**
 * Custom hook for playing audio in voice components
 * @returns Voice player controls and state
 */
export function useVoicePlayer(): UseVoicePlayerReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  // Clean up audio resources when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };
  }, []);

  /**
   * Set audio source from base64 data or data URI
   * @param audioData Base64 encoded audio data or complete data URI
   * @param type Audio MIME type (default: 'audio/mp3')
   */
  const setAudioSource = (audioData: string, type = "audio/mp3") => {
    setIsLoading(true);

    // Cleanup previous audio element and blob URL
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
    }

    try {
      let audioUrl: string;

      // Check if the input is already a data URI
      if (audioData.startsWith("data:")) {
        // Direct use of data URI
        audioUrl = audioData;
      } else {
        // Convert Base64 to a Blob
        const byteCharacters = atob(audioData);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type });

        // Create a URL for the blob
        audioUrl = URL.createObjectURL(blob);
        audioUrlRef.current = audioUrl;
      }

      // Create and configure audio element
      const audio = new Audio(audioUrl);
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
        setIsLoading(false);
      };

      audio.ontimeupdate = () => {
        setProgress(audio.currentTime);
      };

      audio.onended = () => {
        setIsPlaying(false);
        setProgress(0);
      };

      audio.onerror = (e) => {
        setIsLoading(false);
        console.error("Error loading audio:", e);
      };

      audioRef.current = audio;
    } catch (error) {
      console.error("Error setting audio source:", error);
      setIsLoading(false);
    }
  };

  /**
   * Play audio
   */
  const play = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
    }
  };

  /**
   * Pause audio
   */
  const pause = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  /**
   * Stop audio and reset progress
   */
  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setProgress(0);
    }
  };

  /**
   * Seek to a specific time in the audio
   * @param time Time in seconds to seek to
   */
  const seek = (time: number) => {
    if (audioRef.current && time >= 0 && time <= duration) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  /**
   * Toggle between play and pause
   */
  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return {
    isPlaying,
    isLoading,
    progress,
    duration,
    play,
    pause,
    stop,
    togglePlayPause,
    setAudioSource,
    seek,
  };
}
