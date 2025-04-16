import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
  Request,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VoiceService } from './voice.service';
import { RequestWithUser } from '../types/request.types';

@ApiTags('Voice Commands')
@Controller('voice')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VoiceController {
  private readonly logger = new Logger(VoiceController.name);
  constructor(private readonly voiceService: VoiceService) {}

  @Post('process')
  @ApiOperation({ summary: 'Process a voice command' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Command processed successfully',
  })
  async processCommand(
    @Request() req: RequestWithUser,
    @Body()
    body: {
      type: 'audio' | 'text';
      content: string;
      format?: string;
      context?: Record<string, any>;
    },
  ) {
    try {
      return await this.voiceService.processVoiceCommand(
        req.user.id,
        body.type,
        body.content,
        body.format,
        body.context,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(
        'Failed to process voice command',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('commands')
  @ApiOperation({ summary: 'Get available voice commands' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of available commands',
  })
  async getCommands(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    try {
      return await this.voiceService.getAvailableCommands(category, search);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(
        'Failed to fetch available commands',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Get command suggestions based on context' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of command suggestions',
  })
  async getSuggestions(@Query('context') context?: Record<string, any>) {
    try {
      return await this.voiceService.getCommandSuggestions(context || {});
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(
        'Failed to get command suggestions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('history')
  @ApiOperation({ summary: 'Get voice command history' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Command history retrieved',
  })
  async getHistory(
    @Request() req: RequestWithUser,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
    @Query('status') status?: string,
    @Query('intent') intent?: string,
  ) {
    try {
      return await this.voiceService.getCommandHistory(req.user.id, {
        page,
        limit,
        startDate,
        endDate,
        status,
        intent,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(
        'Failed to fetch command history',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('history/:id')
  @ApiOperation({ summary: 'Delete a specific voice command history entry' })
  @ApiResponse({ status: HttpStatus.OK, description: 'History entry deleted' })
  async deleteHistoryEntry(
    @Request() req: RequestWithUser,
    @Param('id') historyId: string,
  ) {
    try {
      return await this.voiceService.deleteCommandHistory(
        req.user.id,
        historyId,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(
        'Failed to delete history entry',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('history')
  @ApiOperation({ summary: 'Clear all voice command history' })
  @ApiResponse({ status: HttpStatus.OK, description: 'History cleared' })
  async clearHistory(@Request() req: RequestWithUser) {
    try {
      return await this.voiceService.clearCommandHistory(req.user.id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(
        'Failed to clear command history',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('transcribe')
  @ApiOperation({ summary: 'Transcribe audio to text' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Audio transcribed successfully',
  })
  async transcribeAudio(
    @Body()
    body: {
      audio: string;
      format?: string;
      model?: string;
      language?: string;
    },
  ) {
    this.logger.debug(
      `Transcribe request received. Format: ${body.format}, Model: ${body.model}, Language: ${body.language}`,
    );
    this.logger.debug(`Audio data length: ${body.audio.length} characters`);

    try {
      const startTime = Date.now();
      const result = await this.voiceService.transcribeAudio(
        body.audio,
        body.format || '',
      );
      const duration = Date.now() - startTime;

      this.logger.debug(`Transcription completed in ${duration}ms`);
      this.logger.debug(
        `Transcription result length: ${result.length} characters`,
      );

      return result;
    } catch (error: unknown) {
      this.logger.error(
        'Transcription error:',
        error instanceof Error ? error.stack : 'Unknown error',
      );
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(
        'Failed to transcribe audio',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('models')
  @ApiOperation({ summary: 'Get available AI models for voice processing' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of available models',
  })
  async getAvailableModels() {
    try {
      return await this.voiceService.getAvailableModels();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(
        'Failed to fetch available models',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('usage')
  @ApiOperation({ summary: 'Get AI model usage statistics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usage statistics retrieved',
  })
  async getUsageStatistics(@Request() _req: RequestWithUser) {
    try {
      return await this.voiceService.getUsageStatistics();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(
        'Failed to fetch usage statistics',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
