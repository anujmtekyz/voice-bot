export interface UsageStatistics {
  totalRequests: number;
  audioProcessed: number;
  commandsExecuted: number;
}

export interface VoiceModel {
  transcription: string[];
  interpretation: string[];
  textToSpeech: string[];
}

export interface CommandInterpretation {
  intent: string;
  confidence: number;
  entities: Record<string, any>;
}

export interface TranscriptionResult {
  transcript: string;
  confidence?: number;
}
