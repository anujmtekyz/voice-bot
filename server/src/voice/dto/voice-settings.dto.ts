import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  IsObject,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CustomCommandDto {
  @ApiProperty({
    description: 'Custom voice command phrase',
    example: 'show my bugs',
  })
  @IsString()
  phrase: string;

  @ApiProperty({ description: 'Action to execute when the phrase is detected' })
  @IsObject()
  action: {
    type: string;
    target: string;
  };
}

export class PrivacySettingsDto {
  @ApiProperty({
    description: 'Whether to store voice command history',
    example: true,
  })
  @IsBoolean()
  storeHistory: boolean;

  @ApiProperty({
    description: 'Number of days to retain voice command history',
    example: 30,
  })
  @IsNumber()
  @Min(1)
  @Max(365)
  historyRetentionDays: number;

  @ApiProperty({
    description: 'Whether to filter sensitive information',
    example: true,
  })
  @IsBoolean()
  filterSensitiveInfo: boolean;
}

export class UpdateVoiceSettingsDto {
  @ApiProperty({
    description: 'Voice type used for responses',
    example: 'joanna',
  })
  @IsString()
  @IsOptional()
  voiceType?: string;

  @ApiProperty({
    description: 'Voice speech rate',
    example: 1.0,
    minimum: 0.5,
    maximum: 2.0,
  })
  @IsNumber()
  @Min(0.5)
  @Max(2)
  @IsOptional()
  voiceSpeed?: number;

  @ApiProperty({
    description: 'Whether voice activation is enabled',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  voiceActivation?: boolean;

  @ApiProperty({
    description: 'Command detection sensitivity',
    example: 0.7,
    minimum: 0.1,
    maximum: 1.0,
  })
  @IsNumber()
  @Min(0.1)
  @Max(1.0)
  @IsOptional()
  sensitivity?: number;

  @ApiProperty({ description: 'Voice recognition language', example: 'en-US' })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty({
    description: 'Whether voice responses are enabled',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  voiceResponseEnabled?: boolean;

  @ApiProperty({
    description: 'Voice response volume',
    example: 0.8,
    minimum: 0,
    maximum: 1.0,
  })
  @IsNumber()
  @Min(0)
  @Max(1.0)
  @IsOptional()
  voiceResponseVolume?: number;

  @ApiProperty({ description: 'Ambient awareness mode', example: true })
  @IsBoolean()
  @IsOptional()
  ambientAwareness?: boolean;

  @ApiProperty({
    description: 'Wake word for activating voice commands',
    example: 'Hey Assistant',
  })
  @IsString()
  @IsOptional()
  wakeWord?: string;

  @ApiProperty({
    description: 'List of custom voice commands',
    type: [CustomCommandDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomCommandDto)
  @IsOptional()
  customCommands?: CustomCommandDto[];

  @ApiProperty({
    description: 'Privacy settings for voice commands',
    type: PrivacySettingsDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => PrivacySettingsDto)
  @IsOptional()
  privacySettings?: PrivacySettingsDto;
}

export class VoiceSettingsResponseDto {
  @ApiProperty({
    description: 'Voice type used for responses',
    example: 'joanna',
  })
  voiceType: string;

  @ApiProperty({ description: 'Voice speech rate', example: 1.0 })
  voiceSpeed: number;

  @ApiProperty({
    description: 'Whether voice activation is enabled',
    example: true,
  })
  voiceActivation: boolean;

  @ApiProperty({ description: 'Command detection sensitivity', example: 0.7 })
  sensitivity: number;

  @ApiProperty({ description: 'Voice recognition language', example: 'en-US' })
  language: string;

  @ApiProperty({
    description: 'Whether voice responses are enabled',
    example: true,
  })
  voiceResponseEnabled: boolean;

  @ApiProperty({ description: 'Voice response volume', example: 0.8 })
  voiceResponseVolume: number;

  @ApiProperty({ description: 'Ambient awareness mode', example: true })
  ambientAwareness: boolean;

  @ApiProperty({
    description: 'Wake word for activating voice commands',
    example: 'Hey Assistant',
  })
  wakeWord: string;

  @ApiProperty({
    description: 'List of custom voice commands',
    type: [CustomCommandDto],
  })
  customCommands: CustomCommandDto[];

  @ApiProperty({
    description: 'Privacy settings for voice commands',
    type: PrivacySettingsDto,
  })
  privacySettings: PrivacySettingsDto;
}
