import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VoiceSettingsRepository } from '../repositories/voice-settings.repository';
import { VoiceSettings } from '../entities/voice-settings.entity';
import {
  UpdateVoiceSettingsDto,
  VoiceSettingsResponseDto,
} from '../dto/voice-settings.dto';
import { OpenAIService } from '../../external/openai.service';

@Injectable()
export class VoiceSettingsService {
  private readonly logger = new Logger(VoiceSettingsService.name);

  constructor(
    @InjectRepository(VoiceSettingsRepository)
    private voiceSettingsRepository: VoiceSettingsRepository,
    private readonly openAIService: OpenAIService,
  ) {}

  /**
   * Get voice settings for a user
   * @param userId User ID
   * @returns Voice settings for the user
   */
  async getVoiceSettings(userId: string): Promise<VoiceSettingsResponseDto> {
    this.logger.debug(`Getting voice settings for user: ${userId}`);

    const settings = await this.voiceSettingsRepository.findByUserId(userId);

    if (!settings) {
      // Return default settings if user doesn't have settings yet
      this.logger.debug(
        `No settings found for user ${userId}, returning defaults`,
      );
      return this.createDefaultSettings();
    }

    return this.mapEntityToResponse(settings);
  }

  /**
   * Update voice settings for a user
   * @param userId User ID
   * @param updateDto Updated settings
   * @returns Updated voice settings
   */
  async updateVoiceSettings(
    userId: string,
    updateDto: UpdateVoiceSettingsDto,
  ): Promise<VoiceSettingsResponseDto> {
    this.logger.debug(`Updating voice settings for user: ${userId}`);

    // Create a partial entity with the updates
    const updates: Partial<VoiceSettings> = {};

    // Map each field from the DTO to the entity
    if (updateDto.voiceType !== undefined)
      updates.voiceType = updateDto.voiceType;
    if (updateDto.voiceSpeed !== undefined)
      updates.voiceSpeed = updateDto.voiceSpeed;
    if (updateDto.voiceActivation !== undefined)
      updates.voiceActivation = updateDto.voiceActivation;
    if (updateDto.sensitivity !== undefined)
      updates.sensitivity = updateDto.sensitivity;
    if (updateDto.language !== undefined) updates.language = updateDto.language;
    if (updateDto.voiceResponseEnabled !== undefined)
      updates.voiceResponseEnabled = updateDto.voiceResponseEnabled;
    if (updateDto.voiceResponseVolume !== undefined)
      updates.voiceResponseVolume = updateDto.voiceResponseVolume;
    if (updateDto.ambientAwareness !== undefined)
      updates.ambientAwareness = updateDto.ambientAwareness;
    if (updateDto.wakeWord !== undefined) updates.wakeWord = updateDto.wakeWord;

    // Handle JSON fields
    if (updateDto.customCommands !== undefined) {
      updates.customCommands = JSON.stringify(updateDto.customCommands);
    }

    if (updateDto.privacySettings !== undefined) {
      updates.privacySettings = JSON.stringify(updateDto.privacySettings);
    }

    // Update or create settings
    const updatedSettings =
      await this.voiceSettingsRepository.createOrUpdateSettings(
        userId,
        updates,
      );

    return this.mapEntityToResponse(updatedSettings);
  }

  /**
   * Get available voice types from OpenAI
   * @returns List of available voice types
   */
  async getAvailableVoiceTypes(): Promise<string[]> {
    // In a real implementation, this would fetch available voices from OpenAI
    // For now, return a static list of common voices after a simulated API call
    await Promise.resolve(); // Adding await to satisfy linter
    return [
      'joanna',
      'matthew',
      'salli',
      'joey',
      'ivy',
      'kendra',
      'kimberly',
      'brian',
    ];
  }

  /**
   * Test voice with specified text
   * @param userId User ID
   * @param text Text to speak
   * @param voiceType Optional custom voice type
   * @param voiceSpeed Optional custom voice speed
   * @returns Audio data and success status
   */
  async testVoice(
    userId: string,
    text: string,
    voiceType?: string,
    voiceSpeed?: number,
  ): Promise<{ success: boolean; audioData?: string }> {
    this.logger.debug(`Testing voice for user ${userId} with text: ${text}`);

    try {
      // Get the user's voice settings
      const settings = await this.voiceSettingsRepository.findByUserId(userId);

      // Use provided parameters or fall back to user settings or defaults
      const effectiveVoiceType = voiceType || settings?.voiceType || 'nova';
      const effectiveVoiceSpeed =
        voiceSpeed !== undefined ? voiceSpeed : settings?.voiceSpeed || 1.0;

      // Map voice type from our system to OpenAI's supported voices
      // OpenAI supports: alloy, echo, fable, onyx, nova, shimmer
      const openAIVoiceMap: Record<string, string> = {
        joanna: 'nova',
        matthew: 'onyx',
        salli: 'shimmer',
        joey: 'echo',
        ivy: 'fable',
        kendra: 'alloy',
        kimberly: 'shimmer',
        brian: 'onyx',
      };

      // Use mapped voice or default to nova
      const openAIVoice = openAIVoiceMap[effectiveVoiceType] || 'nova';

      this.logger.debug(
        `Converting text to speech. User: ${userId}, Voice: ${openAIVoice}, Speed: ${effectiveVoiceSpeed}`,
      );

      // Generate speech using OpenAI TTS
      const audioBuffer = await this.openAIService.textToSpeech(
        text,
        openAIVoice,
        effectiveVoiceSpeed,
      );

      // Convert audio buffer to Base64 for transmission to client
      const audioBase64 = audioBuffer.toString('base64');

      this.logger.debug(
        `Successfully generated speech. Audio size: ${audioBuffer.length} bytes`,
      );

      return {
        success: true,
        audioData: audioBase64,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to generate speech: ${errorMessage}`,
        errorStack,
      );
      return {
        success: false,
      };
    }
  }

  /**
   * Create default voice settings
   * @returns Default voice settings
   */
  private createDefaultSettings(): VoiceSettingsResponseDto {
    return {
      voiceType: 'joanna',
      voiceSpeed: 1.0,
      voiceActivation: true,
      sensitivity: 0.7,
      language: 'en-US',
      voiceResponseEnabled: true,
      voiceResponseVolume: 0.8,
      ambientAwareness: true,
      wakeWord: 'Hey Assistant',
      customCommands: [],
      privacySettings: {
        storeHistory: true,
        historyRetentionDays: 30,
        filterSensitiveInfo: true,
      },
    };
  }

  /**
   * Map entity to response DTO
   * @param entity Voice settings entity
   * @returns Voice settings response DTO
   */
  private mapEntityToResponse(entity: VoiceSettings): VoiceSettingsResponseDto {
    return {
      voiceType: entity.voiceType,
      voiceSpeed: entity.voiceSpeed,
      voiceActivation: entity.voiceActivation,
      sensitivity: entity.sensitivity,
      language: entity.language,
      voiceResponseEnabled: entity.voiceResponseEnabled,
      voiceResponseVolume: entity.voiceResponseVolume,
      ambientAwareness: entity.ambientAwareness,
      wakeWord: entity.wakeWord,
      customCommands: entity.getCustomCommands(),
      privacySettings: entity.getPrivacySettings(),
    };
  }
}
