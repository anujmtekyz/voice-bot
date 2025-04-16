import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoiceService } from './voice.service';
import { VoiceController } from './voice.controller';
import { VoiceCommandHistory } from '../database/entities/voice-command-history.entity';
import { UsersModule } from '../users/users.module';
import { OpenAIModule } from '../external/openai.module';
import { OpenRouterModule } from '../external/openrouter.module';
import { VoiceSettings } from './entities/voice-settings.entity';
import { VoiceSettingsRepository } from './repositories/voice-settings.repository';
import { VoiceSettingsService } from './services/voice-settings.service';
import { VoiceSettingsController } from './controllers/voice-settings.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([VoiceCommandHistory, VoiceSettings]),
    UsersModule,
    OpenAIModule,
    OpenRouterModule,
  ],
  providers: [VoiceService, VoiceSettingsRepository, VoiceSettingsService],
  controllers: [VoiceController, VoiceSettingsController],
  exports: [VoiceService],
})
export class VoiceModule {}
