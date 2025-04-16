/**
 * Utility functions for voice audio operations
 */

/**
 * Converts a base64 audio string to an audio blob
 * @param base64Audio Base64 encoded audio data
 * @param type MIME type of the audio (default: 'audio/mp3')
 * @returns Blob of the audio data
 */
export function base64ToAudioBlob(
  base64Audio: string,
  type = "audio/mp3"
): Blob {
  const byteCharacters = atob(base64Audio);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type });
}

/**
 * Create and play audio from a base64 string
 * @param base64Audio Base64 encoded audio data
 * @param type MIME type of the audio (default: 'audio/mp3')
 * @returns Audio element created
 */
export function playAudioFromBase64(
  base64Audio: string,
  type = "audio/mp3"
): HTMLAudioElement {
  // Convert Base64 to a Blob
  const blob = base64ToAudioBlob(base64Audio, type);

  // Create a URL for the blob
  const audioUrl = URL.createObjectURL(blob);

  // Create and play audio
  const audio = new Audio(audioUrl);
  audio.play().catch((error) => {
    console.error("Error playing audio:", error);
  });

  // Clean up URL after audio ends
  audio.onended = () => {
    URL.revokeObjectURL(audioUrl);
  };

  return audio;
}

/**
 * Convert an audio blob to a base64 string
 * @param audioBlob Audio blob to convert
 * @returns Promise resolving to a base64 string
 */
export function audioToBase64(audioBlob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Audio = reader.result as string;
      // Remove the data URL prefix (e.g., "data:audio/mp3;base64,")
      const base64String = base64Audio.split(",")[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(audioBlob);
  });
}

/**
 * Download base64 audio as a file
 * @param base64Audio Base64 encoded audio data
 * @param filename Name of the file to download
 * @param type MIME type of the audio (default: 'audio/mp3')
 */
export function downloadAudio(
  base64Audio: string,
  filename: string,
  type = "audio/mp3"
): void {
  const blob = base64ToAudioBlob(base64Audio, type);
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}
