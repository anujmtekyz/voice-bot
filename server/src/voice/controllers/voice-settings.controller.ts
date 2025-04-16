import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Req,
  Logger,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VoiceSettingsService } from '../services/voice-settings.service';
import {
  UpdateVoiceSettingsDto,
  VoiceSettingsResponseDto,
} from '../dto/voice-settings.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { TestVoiceDto } from '../dto/test-voice.dto';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';

// Create a constant anonymous UUID that will be used for all anonymous users
// This is better than using 'default-user' which isn't a valid UUID
const ANONYMOUS_USER_UUID = '00000000-0000-0000-0000-000000000000';

// Extend the Express Request type to include our user property
interface RequestWithUser extends Request {
  user?: JwtPayload;
}

@ApiTags('voice-settings')
@Controller('voice/settings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VoiceSettingsController {
  private readonly logger = new Logger(VoiceSettingsController.name);

  constructor(private readonly voiceSettingsService: VoiceSettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user voice settings' })
  @ApiResponse({
    status: 200,
    description: 'Voice settings retrieved successfully',
    type: VoiceSettingsResponseDto,
  })
  async getSettings(
    @Req() req: RequestWithUser,
  ): Promise<VoiceSettingsResponseDto> {
    const userId = req.user?.sub || ANONYMOUS_USER_UUID;
    this.logger.log(`Getting voice settings for user: ${userId}`);

    const settings = await this.voiceSettingsService.getVoiceSettings(userId);

    this.logger.debug(`Retrieved settings:`, settings);
    return settings;
  }

  @Put()
  @ApiOperation({ summary: 'Update user voice settings' })
  @ApiResponse({
    status: 200,
    description: 'Voice settings updated successfully',
    type: VoiceSettingsResponseDto,
  })
  async updateSettings(
    @Req() req: RequestWithUser,
    @Body() updateDto: UpdateVoiceSettingsDto,
  ): Promise<VoiceSettingsResponseDto> {
    const userId = req.user?.sub || ANONYMOUS_USER_UUID;
    this.logger.log(
      `Updating voice settings for user: ${userId} with: ${JSON.stringify(
        updateDto,
      )}`,
    );

    const updatedSettings = await this.voiceSettingsService.updateVoiceSettings(
      userId,
      updateDto,
    );

    this.logger.debug(`Updated settings:`, updatedSettings);
    return updatedSettings;
  }

  @Get('voice-types')
  @ApiOperation({ summary: 'Get available voice types' })
  @ApiResponse({
    status: 200,
    description: 'Available voice types retrieved successfully',
    schema: {
      type: 'array',
      items: { type: 'string' },
    },
  })
  async getVoiceTypes(): Promise<string[]> {
    this.logger.log('Getting available voice types');

    const voiceTypes = await this.voiceSettingsService.getAvailableVoiceTypes();

    this.logger.debug(`Available voices: ${voiceTypes.join(', ')}`);
    return voiceTypes;
  }

  @Post('test')
  @ApiOperation({ summary: 'Test voice with current settings' })
  @ApiResponse({
    status: 200,
    description: 'Voice test completed',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        audioData: { type: 'string' },
      },
    },
  })
  async testVoice(
    @Req() req: RequestWithUser,
    @Body() testVoiceDto: TestVoiceDto,
  ): Promise<{ success: boolean; audioData?: string }> {
    const userId = req.user?.sub || ANONYMOUS_USER_UUID;
    this.logger.log(
      `Testing voice for user: ${userId} with text: ${testVoiceDto.text}`,
    );

    const result = await this.voiceSettingsService.testVoice(
      userId,
      testVoiceDto.text,
      testVoiceDto.voiceId,
      testVoiceDto.speed,
    );

    if (result.success) {
      this.logger.debug('Voice test successful');
    } else {
      this.logger.error('Voice test failed');
    }

    return result;
  }
}
