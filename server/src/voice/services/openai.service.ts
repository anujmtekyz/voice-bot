import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenaiService {
  private readonly openai: OpenAI;
  private readonly logger = new Logger(OpenaiService.name);

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  /**
   * Convert text to speech using OpenAI API
   * @param text - The text to convert to speech
   * @param voice - The voice to use (alloy, echo, fable, onyx, nova, shimmer)
   * @param speed - The speed of the speech (0.25 to 4.0)
   * @returns Buffer containing the audio data
   */
  async textToSpeech(
    text: string,
    voice: string = 'alloy',
    speed: number = 1.0,
  ): Promise<Buffer> {
    try {
      this.logger.debug(
        `Converting text to speech: "${text}" with voice: ${voice}, speed: ${speed}`,
      );

      const response = await this.openai.audio.speech.create({
        model: 'tts-1',
        voice,
        input: text,
        speed,
      });

      // Get the response as an ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();

      // Convert ArrayBuffer to Buffer
      const buffer = Buffer.from(arrayBuffer);

      this.logger.debug(
        `Successfully converted text to speech, audio size: ${buffer.length} bytes`,
      );
      return buffer;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error(
        `Error converting text to speech: ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }
}
