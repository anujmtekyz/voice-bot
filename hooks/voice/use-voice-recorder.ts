import { useState, useEffect, useRef } from "react";
import { audioToBase64 } from "@/lib/voice-utils";

interface UseVoiceRecorderReturn {
  isRecording: boolean;
  recordingTime: number;
  audioBlob: Blob | null;
  audioBase64: string | null;
  isProcessing: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  resetRecording: () => void;
  hasRecording: boolean;
}

/**
 * Custom hook for voice recording
 * @param onProcessingComplete Optional callback when processing is complete
 * @returns Voice recorder controls and state
 */
export function useVoiceRecorder(
  onProcessingComplete?: (base64Audio: string) => void
): UseVoiceRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  /**
   * Start recording audio
   */
  const startRecording = async (): Promise<void> => {
    try {
      // Reset state
      audioChunksRef.current = [];
      setAudioBlob(null);
      setAudioBase64(null);
      setRecordingTime(0);

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);

        // Create blob from audio chunks
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setAudioBlob(audioBlob);

        try {
          // Convert to base64
          const base64Audio = await audioToBase64(audioBlob);
          setAudioBase64(base64Audio);

          if (onProcessingComplete) {
            onProcessingComplete(base64Audio);
          }
        } catch (error) {
          console.error("Error converting audio to base64:", error);
        } finally {
          setIsProcessing(false);
        }

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);

      // Set up timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  /**
   * Stop recording audio
   */
  const stopRecording = async (): Promise<void> => {
    if (!isRecording || !mediaRecorderRef.current) {
      return;
    }

    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Stop recording
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  /**
   * Reset recording state
   */
  const resetRecording = (): void => {
    setAudioBlob(null);
    setAudioBase64(null);
    setRecordingTime(0);
  };

  return {
    isRecording,
    recordingTime,
    audioBlob,
    audioBase64,
    isProcessing,
    startRecording,
    stopRecording,
    resetRecording,
    hasRecording: !!audioBlob,
  };
}
