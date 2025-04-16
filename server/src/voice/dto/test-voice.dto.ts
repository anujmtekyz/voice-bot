import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsNumber,
  IsOptional,
} from 'class-validator';

/**
 * DTO for testing voice with specified text
 */
export class TestVoiceDto {
  @ApiProperty({
    description: 'Text to convert to speech',
    example: 'Hello, this is a test of the voice system.',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  text: string;

  @ApiProperty({
    description: 'Voice type/ID to use',
    example: 'joanna',
    required: false,
  })
  @IsString()
  @IsOptional()
  voiceId?: string;

  @ApiProperty({
    description: 'Voice pitch adjustment',
    example: 0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  pitch?: number;

  @ApiProperty({
    description: 'Voice speed adjustment',
    example: 1.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  speed?: number;
}
