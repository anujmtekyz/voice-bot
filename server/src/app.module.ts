import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VoiceModule } from './voice/voice.module';
import configuration, { validationSchema } from './config/configuration';
import { DatabaseConfig } from './database/database.config';
import { OpenAIModule } from './external/openai.module';
import { CustomLogger } from './common/logger/custom-logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      validationOptions: {
        abortEarly: true,
        allowUnknown: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    AuthModule,
    UsersModule,
    VoiceModule,
    OpenAIModule,
  ],
  providers: [CustomLogger],
  exports: [CustomLogger],
})
export class AppModule {}
