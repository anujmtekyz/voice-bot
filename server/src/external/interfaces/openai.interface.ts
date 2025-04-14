/**
 * Interface for OpenAI client transcription functionality
 */
export interface IOpenAIClient {
  audio: {
    transcriptions: {
      create(params: any): Promise<{ text: string }>;
    };
  };
}

/**
 * Token for OpenAI client dependency injection
 */
export const OPENAI_CLIENT = 'OPENAI_CLIENT';
