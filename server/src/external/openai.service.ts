import { Injectable, Logger, Inject } from '@nestjs/common';
import OpenAI from 'openai';
import { IOpenAIClient, OPENAI_CLIENT } from './interfaces/openai.interface';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';

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
    let tempFilePath: string | null = null;

    try {
      this.logger.debug(`Starting Whisper transcription. Format: ${format}`);

      if (!audioData) {
        throw new Error('Audio data is null or undefined');
      }

      // Convert base64 to buffer
      const audioBuffer = Buffer.from(audioData, 'base64');
      this.logger.debug(
        `Audio buffer created. Size: ${audioBuffer.length} bytes`,
      );

      if (!format) {
        throw new Error('Audio format is null or undefined');
      }

      // Save buffer to temporary file
      const tempDir = os.tmpdir();
      const randomId = crypto.randomBytes(16).toString('hex');
      tempFilePath = path.join(tempDir, `audio-${randomId}.${format}`);

      fs.writeFileSync(tempFilePath, audioBuffer);
      this.logger.debug(`Audio saved to temporary file: ${tempFilePath}`);

      // Open the file as a stream for the OpenAI API
      const fileStream = fs.createReadStream(tempFilePath);

      const response = await this.openai.audio.transcriptions.create({
        file: fileStream,
        model: 'whisper-1',
      });

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
    } finally {
      // Clean up temporary file
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
        this.logger.debug(`Temporary file deleted: ${tempFilePath}`);
      }
    }
  }

  /**
   * Convert text to speech using OpenAI's TTS API
   * @param text Text to convert to speech
   * @param voice Voice model to use (e.g., 'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer')
   * @param speed Voice speed (0.25 to 4.0)
   * @returns Audio buffer
   */
  async textToSpeech(
    text: string,
    voice: string = 'nova',
    speed: number = 1.0,
  ): Promise<Buffer> {
    try {
      this.logger.debug(
        `Starting TTS conversion. Text length: ${text.length}, Voice: ${voice}, Speed: ${speed}`,
      );

      // Adjust voice to one of the supported models if not valid
      const supportedVoices = [
        'alloy',
        'echo',
        'fable',
        'onyx',
        'nova',
        'shimmer',
      ];
      if (!supportedVoices.includes(voice)) {
        this.logger.warn(`Unsupported voice: ${voice}. Falling back to 'nova'`);
        voice = 'nova';
      }

      // Clamp speed to allowed range
      const clampedSpeed = Math.max(0.25, Math.min(4.0, speed));
      if (clampedSpeed !== speed) {
        this.logger.warn(
          `Speed ${speed} outside of allowed range (0.25-4.0). Clamped to ${clampedSpeed}`,
        );
      }

      const response = await this.openai.audio.speech.create({
        model: 'tts-1',
        voice,
        input: text,
        speed: clampedSpeed,
      });

      // Convert the response to a buffer
      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      this.logger.error('TTS conversion error:', error);
      throw error;
    }
  }
}
