import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VoiceModule } from './voice/voice.module';
import helmet from 'helmet';
import configuration from './config/configuration';
import { Request, Response, NextFunction } from 'express';

import { User } from './database/entities/user.entity';
import { UserSettings } from './database/entities/user-settings.entity';
import { RefreshToken } from './database/entities/refresh-token.entity';
import { VoiceCommandHistory } from './database/entities/voice-command-history.entity';
import { Project } from './database/entities/project.entity';
import { Issue } from './database/entities/issue.entity';
import { Report } from './database/entities/report.entity';
import { Notification } from './database/entities/notification.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
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
        synchronize: configService.get('environment') !== 'production',
      }),
    }),
    // Rate limiting configuration to prevent brute-force attacks
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): ThrottlerModuleOptions => ({
        throttlers: [
          {
            ttl: configService.get<number>('throttler.ttl') || 60,
            limit: configService.get<number>('throttler.limit') || 10,
          },
        ],
      }),
    }),
    AuthModule,
    UsersModule,
    VoiceModule,
  ],
  providers: [
    // Apply rate limiting globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply security middlewares
    consumer
      .apply((req: Request, res: Response, next: NextFunction) => {
        // Use helmet as a function
        helmet()(req, res, next);
      })
      .forRoutes('*');
  }
}
