/**
 * Interface for OpenAI client
 */
export interface IOpenAIClient {
  audio: {
    transcriptions: {
      create(params: any): Promise<{ text: string }>;
    };
    speech: {
      create(params: any): Promise<any>;
    };
  };
}

/**
 * Token for OpenAI client dependency injection
 */
export const OPENAI_CLIENT = 'OPENAI_CLIENT';
