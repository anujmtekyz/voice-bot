import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

/**
 * Entity representing the history of voice commands issued by users
 */
@Entity('voice_command_history')
export class VoiceCommandHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  transcript: string;

  @Column({ nullable: true })
  intent: string;

  @Column({ type: 'jsonb', nullable: true })
  entities: string;

  @Column({
    type: 'enum',
    enum: ['successful', 'failed', 'processing'],
    default: 'processing',
  })
  status: string;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @Column({ type: 'jsonb', nullable: true })
  response: string;

  @Column({ type: 'jsonb', nullable: true })
  actionTaken: string;

  @Column({ name: 'audio_reference', nullable: true })
  audioReference: string;

  @Column({ name: 'processing_time', type: 'float', nullable: true })
  processingTime: number;

  @Column({ name: 'confidence_score', type: 'float', nullable: true })
  confidenceScore: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.voiceCommandHistory)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
