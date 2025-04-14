/**
 * Service for handling voice-related functionality
 */
export class VoiceService {
  private static instance: VoiceService;
  private apiUrl: string;

  private constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  }

  public static getInstance(): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
  }

  /**
   * Convert audio data to text using the server's transcription service
   */
  async transcribeAudio(audioData: string, format: string): Promise<string> {
    try {
      const response = await fetch(`${this.apiUrl}/voice/login/transcribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audioData, format }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Transcription failed');
      }

      return data.transcript;
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  }

  /**
   * Convert audio blob to base64 string
   */
  async convertAudioToBase64(audioBlob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Audio = reader.result as string;
        // Remove the data URL prefix (e.g., "data:audio/webm;base64,")
        const base64String = base64Audio.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });
  }
} 