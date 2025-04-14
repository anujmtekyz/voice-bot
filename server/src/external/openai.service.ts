import { Injectable, Logger, Inject } from '@nestjs/common';
import OpenAI from 'openai';
import FormData from 'form-data';
import { IOpenAIClient, OPENAI_CLIENT } from './interfaces/openai.interface';

@Injectable()
export class OpenAIClientFactory {
  static create(apiKey: string): IOpenAIClient {
    return new OpenAI({ apiKey });
  }
}

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);

  constructor(
    @Inject(OPENAI_CLIENT)
    private readonly openai: IOpenAIClient,
  ) {}

  /**
   * Transcribe audio to text using Whisper model
   * @param audioData Base64-encoded audio data
   * @param format Audio format (e.g., 'webm', 'mp3', 'wav')
   * @returns Transcribed text
   */
  async transcribe(audioData: string, format: string): Promise<string> {
    try {
      this.logger.debug(`Starting Whisper transcription. Format: ${format}`);
      const audioBuffer = Buffer.from(audioData, 'base64');
      const formData = new FormData();
      formData.append('file', audioBuffer, {
        filename: `audio.${format}`,
        contentType: `audio/${format}`,
      });
      formData.append('model', 'whisper-1');
      formData.append('language', 'en');

      const response = await this.openai.audio.transcriptions.create(
        formData as any,
      );

      if (!response.text) {
        throw new Error('No transcription received from Whisper');
      }

      this.logger.debug(
        `Transcription successful. Length: ${response.text.length} characters`,
      );
      return response.text;
    } catch (error) {
      this.logger.error('Whisper transcription error:', error);
      throw error;
    }
  }
}
