import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole } from '../../auth/enums/user-role.enum';
import { RefreshToken } from './refresh-token.entity';
import { UserSettings } from './user-settings.entity';
import { VoiceCommandHistory } from './voice-command-history.entity';
import { Project } from './project.entity';
import { Issue } from './issue.entity';
import { Report } from './report.entity';
import { Notification } from './notification.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ name: 'jira_api_token', nullable: true })
  @Exclude({ toPlainOnly: true })
  jiraApiToken: string;

  @Column({ name: 'jira_email', nullable: true })
  jiraEmail: string;

  @Column({ name: 'jira_server_url', nullable: true })
  jiraServerUrl: string;

  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @Column({ name: 'last_login_at', nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @OneToOne(() => UserSettings, (settings) => settings.user)
  settings: UserSettings;

  @OneToMany(() => VoiceCommandHistory, (commandHistory) => commandHistory.user)
  voiceCommandHistory: VoiceCommandHistory[];

  @OneToMany(() => Project, (project) => project.lead)
  leadProjects: Project[];

  @OneToMany(() => Issue, (issue) => issue.assignee)
  assignedIssues: Issue[];

  @OneToMany(() => Issue, (issue) => issue.reporter)
  reportedIssues: Issue[];

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
