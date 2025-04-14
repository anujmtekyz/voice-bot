import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoiceService } from './voice.service';
import { VoiceController } from './voice.controller';
import { VoiceCommandHistory } from '../database/entities/voice-command-history.entity';
import { UsersModule } from '../users/users.module';
import { OpenRouterModule } from '../external/openrouter.module';
import { OpenAIModule } from '../external/openai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VoiceCommandHistory]),
    UsersModule,
    OpenRouterModule,
    OpenAIModule,
  ],
  controllers: [VoiceController],
  providers: [VoiceService],
  exports: [VoiceService],
})
export class VoiceModule {}
