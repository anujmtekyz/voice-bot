import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { VoiceSettings } from '../entities/voice-settings.entity';

@Injectable()
export class VoiceSettingsRepository extends Repository<VoiceSettings> {
  constructor(private dataSource: DataSource) {
    super(VoiceSettings, dataSource.createEntityManager());
  }

  /**
   * Find settings by user ID
   * @param userId User ID
   * @returns Voice settings for the user or null if not found
   */
  async findByUserId(userId: string): Promise<VoiceSettings | null> {
    return this.findOne({ where: { userId } });
  }

  /**
   * Create or update voice settings for a user
   * @param userId User ID
   * @param settings Voice settings data
   * @returns Updated voice settings
   */
  async createOrUpdateSettings(
    userId: string,
    settings: Partial<VoiceSettings>,
  ): Promise<VoiceSettings> {
    let voiceSettings = await this.findByUserId(userId);

    if (!voiceSettings) {
      // Create new settings if they don't exist
      voiceSettings = this.create({
        userId,
        ...settings,
      });
    } else {
      // Update existing settings
      this.merge(voiceSettings, settings);
    }

    return this.save(voiceSettings);
  }
}
