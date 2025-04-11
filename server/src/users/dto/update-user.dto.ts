import { IsEmail, IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../auth/enums/user-role.enum';

/**
 * Data Transfer Object for updating user information
 */
export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'User first name',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'User role',
    enum: UserRole,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'JIRA API token',
    example: 'jira_api_token_123',
  })
  @IsOptional()
  @IsString()
  jiraApiToken?: string;

  @ApiPropertyOptional({
    description: 'JIRA email address',
    example: 'jira@example.com',
  })
  @IsOptional()
  @IsEmail()
  jiraEmail?: string;

  @ApiPropertyOptional({
    description: 'JIRA server URL',
    example: 'https://company.atlassian.net',
  })
  @IsOptional()
  @IsString()
  jiraServerUrl?: string;
}
