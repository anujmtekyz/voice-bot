import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoiceService } from './voice.service';
import { VoiceController } from './voice.controller';
import { VoiceCommandHistory } from '../database/entities/voice-command-history.entity';
import { UserModule } from '../user/user.module';
import { OpenRouterService } from '../external/openrouter.service';

@Module({
  imports: [TypeOrmModule.forFeature([VoiceCommandHistory]), UserModule],
  controllers: [VoiceController],
  providers: [VoiceService, OpenRouterService],
  exports: [VoiceService],
})
export class VoiceModule {}
