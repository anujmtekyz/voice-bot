import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_settings')
export class UserSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'voice_activation', default: true })
  voiceActivation: boolean;

  @Column({ name: 'voice_sensitivity', default: 0.5 })
  voiceSensitivity: number;

  @Column({ default: 'en-US' })
  language: string;

  @Column({ name: 'theme', default: 'light' })
  theme: string;

  @Column({ name: 'notifications_enabled', default: true })
  notificationsEnabled: boolean;

  @Column({ name: 'daily_summary_enabled', default: true })
  dailySummaryEnabled: boolean;

  @Column({ name: 'custom_commands', type: 'jsonb', default: '[]' })
  customCommands: string;

  @Column({ name: 'privacy_mode', default: false })
  privacyMode: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @OneToOne(() => User, (user) => user.settings)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
