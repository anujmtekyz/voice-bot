import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

/**
 * Service for interacting with OpenRouter AI models
 */
@Injectable()
export class OpenRouterService {
  private readonly logger = new Logger(OpenRouterService.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENROUTER_API_KEY') || '';
    this.baseUrl =
      this.configService.get<string>('OPENROUTER_BASE_URL') ||
      'https://openrouter.ai/api/v1';

    if (!this.apiKey) {
      this.logger.warn(
        'OPENROUTER_API_KEY is not set. Voice processing features will not work properly.',
      );
    }
  }

  /**
   * Transcribe audio to text using OpenRouter's Whisper model
   * @param audioData Base64-encoded audio data
   * @param format Audio format
   * @param model Specific model to use for transcription (optional)
   * @param language Language code (optional)
   */
  async transcribe(
    audioData: string,
    format?: string,
    model: string = 'anthropic/claude-3-haiku',
    language?: string,
  ): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/audio/transcriptions`,
        {
          file: audioData,
          model,
          language,
          format: format || 'mp3',
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data && response.data.text) {
        return response.data.text;
      }

      throw new Error('Invalid response format from transcription service');
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`Transcription error: ${err.message}`, err.stack);
      throw new Error(`Failed to transcribe audio: ${err.message}`);
    }
  }

  /**
   * Interpret text to extract intent and entities
   * @param transcript Text transcript to interpret
   * @param context Additional context to help with interpretation
   */
  async interpret(
    transcript: string,
    context?: Record<string, any>,
  ): Promise<{ intent: string; entities: any; confidence: number }> {
    try {
      // Prepare the prompt for the AI model
      const systemPrompt = `You are an AI assistant that extracts intent and entities from voice commands. 
      Analyze the user's voice command and identify:
      1. The main intent (e.g., create_ticket, find_tickets, update_ticket, get_project_info)
      2. Relevant entities mentioned (e.g., project names, ticket IDs, priorities, assignees)
      
      Return your analysis as a JSON object with 'intent' and 'entities' fields.`;

      const userPrompt = `Voice command: "${transcript}"`;

      // If context is provided, add it to the prompt
      const contextPrompt = context
        ? `\n\nAdditional context: ${JSON.stringify(context)}`
        : '';

      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'anthropic/claude-3-opus',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt + contextPrompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.1,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data && response.data.choices && response.data.choices[0]) {
        const content = response.data.choices[0].message.content;
        const parsedContent = JSON.parse(content);

        if (parsedContent.intent && parsedContent.entities) {
          return {
            intent: parsedContent.intent,
            entities: parsedContent.entities,
            confidence: parsedContent.confidence || 0.9,
          };
        }
      }

      throw new Error('Invalid response format from interpretation service');
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`Interpretation error: ${err.message}`, err.stack);
      throw new Error(`Failed to interpret transcript: ${err.message}`);
    }
  }

  /**
   * Generate speech from text
   * @param text Text to convert to speech
   * @param voice Voice ID or style
   */
  async textToSpeech(text: string, voice: string = 'default'): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/audio/speech`,
        {
          input: text,
          voice,
          response_format: 'mp3',
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
        },
      );

      // Convert audio data to base64
      const audioBase64 = Buffer.from(response.data).toString('base64');
      return audioBase64;
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`Text-to-speech error: ${err.message}`, err.stack);
      throw new Error(`Failed to generate speech: ${err.message}`);
    }
  }

  /**
   * Get available OpenRouter models for voice processing
   */
  async getAvailableModels(): Promise<{
    transcription: any[];
    interpretation: any[];
    textToSpeech: any[];
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/models`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      // Filter and categorize models by purpose
      const models = response.data.data || [];

      const transcriptionModels = models.filter((model: any) =>
        model.capabilities.includes('audio-transcription'),
      );

      const interpretationModels = models.filter(
        (model: any) =>
          model.capabilities.includes('chat') && model.context_length >= 8000,
      );

      const textToSpeechModels = models.filter((model: any) =>
        model.capabilities.includes('text-to-speech'),
      );

      return {
        transcription: transcriptionModels,
        interpretation: interpretationModels,
        textToSpeech: textToSpeechModels,
      };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Error fetching available models: ${err.message}`,
        err.stack,
      );

      // Return some default models as fallback
      return {
        transcription: [
          {
            id: 'openai/whisper',
            name: 'Whisper',
            description: 'High-accuracy speech recognition',
          },
        ],
        interpretation: [
          {
            id: 'anthropic/claude-3-opus',
            name: 'Claude 3 Opus',
            description: 'Most capable model for complex tasks',
          },
          {
            id: 'anthropic/claude-3-sonnet',
            name: 'Claude 3 Sonnet',
            description: 'Balanced performance and efficiency',
          },
          {
            id: 'anthropic/claude-3-haiku',
            name: 'Claude 3 Haiku',
            description: 'Fastest model for quick responses',
          },
        ],
        textToSpeech: [
          {
            id: 'openai/tts-1',
            name: 'TTS-1',
            description: 'Natural-sounding speech synthesis',
          },
        ],
      };
    }
  }

  /**
   * Get usage statistics for OpenRouter API
   */
  async getUsageStatistics(): Promise<{
    requests: { [key: string]: number };
    tokens: { [key: string]: number };
    costs: { [key: string]: number };
    limits: { [key: string]: number };
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/usage`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      return response.data;
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Error fetching usage statistics: ${err.message}`,
        err.stack,
      );

      // Return mock data as fallback
      return {
        requests: {
          total: 0,
          transcription: 0,
          interpretation: 0,
          textToSpeech: 0,
        },
        tokens: {
          total: 0,
          input: 0,
          output: 0,
        },
        costs: {
          total: 0,
          transcription: 0,
          interpretation: 0,
          textToSpeech: 0,
        },
        limits: {
          requestsPerMinute: 60,
          requestsPerDay: 10000,
          tokensPerMinute: 100000,
          tokensPerDay: 1000000,
        },
      };
    }
  }
}
