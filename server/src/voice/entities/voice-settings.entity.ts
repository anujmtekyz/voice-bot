import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../database/entities/user.entity';

@Entity('voice_settings')
export class VoiceSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'voice_type', default: 'joanna' })
  voiceType: string;

  @Column({ name: 'voice_speed', type: 'float', default: 1.0 })
  voiceSpeed: number;

  @Column({ name: 'voice_activation', default: true })
  voiceActivation: boolean;

  @Column({ name: 'sensitivity', type: 'float', default: 0.7 })
  sensitivity: number;

  @Column({ name: 'language', default: 'en-US' })
  language: string;

  @Column({ name: 'voice_response_enabled', default: true })
  voiceResponseEnabled: boolean;

  @Column({ name: 'voice_response_volume', type: 'float', default: 0.8 })
  voiceResponseVolume: number;

  @Column({ name: 'ambient_awareness', default: true })
  ambientAwareness: boolean;

  @Column({ name: 'wake_word', default: 'Hey Assistant' })
  wakeWord: string;

  @Column({ name: 'custom_commands', type: 'json', default: '[]' })
  customCommands: string; // Stored as JSON string

  @Column({
    name: 'privacy_settings',
    type: 'json',
    default:
      '{"storeHistory":true,"historyRetentionDays":30,"filterSensitiveInfo":true}',
  })
  privacySettings: string; // Stored as JSON string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Helper methods to handle JSON conversion
  setCustomCommands(commands: any[]): void {
    this.customCommands = JSON.stringify(commands);
  }

  getCustomCommands(): any[] {
    try {
      return JSON.parse(this.customCommands);
    } catch {
      return [];
    }
  }

  setPrivacySettings(settings: any): void {
    this.privacySettings = JSON.stringify(settings);
  }

  getPrivacySettings(): any {
    try {
      return JSON.parse(this.privacySettings);
    } catch {
      return {
        storeHistory: true,
        historyRetentionDays: 30,
        filterSensitiveInfo: true,
      };
    }
  }
}
