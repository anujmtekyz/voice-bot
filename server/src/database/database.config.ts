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
    const isProduction =
      this.configService.get<string>('environment') === 'production';
    const isTest = this.configService.get<string>('environment') === 'test';

    let dbName = this.configService.get<string>('database.database');
    if (isTest) {
      dbName = `${dbName}_test`; // Use a separate database for testing
      console.log(`Using test database: ${dbName}`); // Log confirmation
    }

    return {
      type: 'postgres',
      host: this.configService.get<string>('database.host'),
      port: this.configService.get<number>('database.port'),
      username: this.configService.get<string>('database.username'),
      password: this.configService.get<string>('database.password'),
      database: dbName, // Use potentially modified dbName
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
      // Synchronize schema in dev/test, migrations in prod
      synchronize: !isProduction,
      logging: this.configService.get<boolean>('database.logging'),
      ssl: this.configService.get<boolean>('database.ssl'),
      // Drop schema can be useful in test environment to start fresh, use with caution
      // dropSchema: isTest,
    };
  }
}
