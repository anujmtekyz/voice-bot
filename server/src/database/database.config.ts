import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { UserSettings } from './entities/user-settings.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { VoiceCommandHistory } from './entities/voice-command-history.entity';
import { Project } from './entities/project.entity';
import { Issue } from './entities/issue.entity';
import { Report } from './entities/report.entity';
import { Notification } from './entities/notification.entity';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('database.host'),
      port: this.configService.get<number>('database.port'),
      username: this.configService.get<string>('database.username'),
      password: this.configService.get<string>('database.password'),
      database: this.configService.get<string>('database.database'),
      entities: [
        User,
        UserSettings,
        RefreshToken,
        VoiceCommandHistory,
        Project,
        Issue,
        Report,
        Notification,
      ],
      synchronize:
        this.configService.get<string>('environment') !== 'production',
      logging: this.configService.get<boolean>('database.logging'),
      ssl: this.configService.get<boolean>('database.ssl'),
    };
  }
}
