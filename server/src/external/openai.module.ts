import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OpenAIService, OpenAIClientFactory } from './openai.service';
import { OPENAI_CLIENT } from './interfaces/openai.interface';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: OPENAI_CLIENT,
      useFactory: (configService: ConfigService) => {
        const apiKey = configService.get<string>('OPENAI_API_KEY');
        if (!apiKey) {
          throw new Error('OPENAI_API_KEY is required');
        }
        return OpenAIClientFactory.create(apiKey);
      },
      inject: [ConfigService],
    },
    OpenAIService,
  ],
  exports: [OpenAIService],
})
export class OpenAIModule {}
