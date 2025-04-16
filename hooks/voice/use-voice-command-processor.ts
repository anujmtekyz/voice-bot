import { useState, useEffect, useRef, useCallback } from "react";
import { useVoiceRecorder } from "./use-voice-recorder";
import { voiceTranscriptionApi } from "@/lib/api";

interface VoiceCommandProcessorOptions {
  wakeWord?: string;
  sensitivity?: number;
  voiceActivation?: boolean;
  onWakeWordDetected?: () => void;
  onCommandDetected?: (command: string) => void;
  onCommandProcessed?: (result: {
    success: boolean;
    command?: string;
    action?: string;
    data?: any;
    error?: string;
  }) => void;
  onError?: (error: string) => void;
}

interface UseVoiceCommandProcessorReturn {
  isListening: boolean;
  isProcessing: boolean;
  startListening: () => void;
  stopListening: () => void;
  lastCommand: string | null;
  lastCommandResult: any | null;
  manuallyProcessCommand: (text: string) => Promise<boolean>;
  error: string | null;
}

/**
 * Custom hook for processing voice commands
 * @param options Voice command processor options
 * @returns Voice command processor controls and state
 */
export function useVoiceCommandProcessor(
  options: VoiceCommandProcessorOptions = {}
): UseVoiceCommandProcessorReturn {
  const {
    wakeWord = "Hey Assistant",
    sensitivity = 0.7,
    voiceActivation = true,
    onWakeWordDetected,
    onCommandDetected,
    onCommandProcessed,
    onError,
  } = options;

  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [lastCommandResult, setLastCommandResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use the voice recorder hook to handle audio recording
  const { isRecording, audioBase64, startRecording, stopRecording } =
    useVoiceRecorder(handleRecordingComplete);

  // Reset error when options change
  useEffect(() => {
    setError(null);
  }, [wakeWord, sensitivity, voiceActivation]);

  // Handle completion of voice recording
  async function handleRecordingComplete(audioData: string) {
    if (!voiceActivation) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Transcribe the audio to text
      const transcriptionResult = await voiceTranscriptionApi.transcribe(
        audioData,
        "webm"
      );

      if (transcriptionResult.success && transcriptionResult.text) {
        const commandText = transcriptionResult.text.trim();

        // Check if the command contains the wake word
        if (containsWakeWord(commandText, wakeWord, sensitivity)) {
          // Notify wake word detected if callback provided
          if (onWakeWordDetected) {
            onWakeWordDetected();
          }

          // Extract the actual command (text after the wake word)
          const extractedCommand = extractCommand(commandText, wakeWord);
          setLastCommand(extractedCommand);

          // Notify command detected if callback provided
          if (onCommandDetected) {
            onCommandDetected(extractedCommand);
          }

          // Process the command
          await processCommand(extractedCommand);
        } else {
          // No wake word detected
          const newError = `Wake word "${wakeWord}" not detected in: "${commandText}"`;
          setError(newError);
          if (onError) onError(newError);

          if (onCommandProcessed) {
            onCommandProcessed({
              success: false,
              error: newError,
            });
          }
        }
      } else {
        // Failed to transcribe
        const newError =
          transcriptionResult.message || "Failed to transcribe audio";
        setError(newError);
        if (onError) onError(newError);

        if (onCommandProcessed) {
          onCommandProcessed({
            success: false,
            error: newError,
          });
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error processing voice command";
      console.error("Error processing voice command:", error);
      setError(errorMessage);
      if (onError) onError(errorMessage);

      if (onCommandProcessed) {
        onCommandProcessed({
          success: false,
          error: errorMessage,
        });
      }
    } finally {
      setIsProcessing(false);
    }
  }

  /**
   * Process a command text
   * @param commandText Command text to process
   * @returns Promise resolving to success status
   */
  const processCommand = async (commandText: string): Promise<boolean> => {
    try {
      const result = await voiceTranscriptionApi.processCommand(commandText);

      setLastCommandResult(result);

      // Notify command processed if callback provided
      if (onCommandProcessed) {
        onCommandProcessed(result);
      }

      return result.success;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error processing command";
      console.error("Error processing command:", error);
      setError(errorMessage);

      if (onError) onError(errorMessage);

      if (onCommandProcessed) {
        onCommandProcessed({
          success: false,
          command: commandText,
          error: errorMessage,
        });
      }

      return false;
    }
  };

  /**
   * Manually process a command text
   * @param commandText Command text to process
   * @returns Promise resolving to success status
   */
  const manuallyProcessCommand = async (
    commandText: string
  ): Promise<boolean> => {
    setLastCommand(commandText);
    setError(null);

    // Notify command detected if callback provided
    if (onCommandDetected) {
      onCommandDetected(commandText);
    }

    setIsProcessing(true);
    const success = await processCommand(commandText);
    setIsProcessing(false);

    return success;
  };

  /**
   * Check if text contains the wake word
   * @param text Text to check
   * @param wakeWord Wake word to look for
   * @param sensitivity Sensitivity threshold (0-1)
   * @returns Whether the text contains the wake word
   */
  function containsWakeWord(
    text: string,
    wakeWord: string,
    sensitivity: number
  ): boolean {
    const normalizedText = text.toLowerCase();
    const normalizedWakeWord = wakeWord.toLowerCase();

    // Simple exact match
    if (normalizedText.includes(normalizedWakeWord)) {
      return true;
    }

    // For higher sensitivity, try to match parts of the wake word
    if (sensitivity > 0.5) {
      const wakeWordParts = normalizedWakeWord.split(" ");

      // If multi-word wake word, check if most parts are present
      if (wakeWordParts.length > 1) {
        const requiredPartsCount = Math.ceil(
          wakeWordParts.length * sensitivity
        );
        let matchedParts = 0;

        for (const part of wakeWordParts) {
          if (part.length > 3 && normalizedText.includes(part)) {
            matchedParts++;
          }
        }

        return matchedParts >= requiredPartsCount;
      }
    }

    return false;
  }

  /**
   * Extract the command from text after the wake word
   * @param text Full text with wake word
   * @param wakeWord Wake word to remove
   * @returns Extracted command
   */
  function extractCommand(text: string, wakeWord: string): string {
    const normalizedText = text.toLowerCase();
    const normalizedWakeWord = wakeWord.toLowerCase();

    if (normalizedText.includes(normalizedWakeWord)) {
      const index = normalizedText.indexOf(normalizedWakeWord);
      // Return text after wake word, starting with the original case
      return text.slice(index + wakeWord.length).trim();
    }

    // If wake word not found exactly, just return the original text
    return text.trim();
  }

  return {
    isListening: isRecording,
    isProcessing,
    startListening: startRecording,
    stopListening: stopRecording,
    lastCommand,
    lastCommandResult,
    manuallyProcessCommand,
    error,
  };
}
