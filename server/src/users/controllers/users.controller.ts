import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../../auth/interfaces/request-with-user.interface';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

/**
 * Controller for user profile and preferences management
 */
@ApiTags('User Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get current user profile
   *
   * @param {RequestWithUser} req - Express request with user data
   * @returns {Promise<any>} User profile data
   */
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @Get('profile')
  async getProfile(@Request() req: RequestWithUser) {
    return this.usersService.getProfile(req.user.sub);
  }

  /**
   * Update user profile
   *
   * @param {RequestWithUser} req - Express request with user data
   * @param {UpdateUserDto} updateUserDto - Updated user data
   * @returns {Promise<any>} Updated user profile
   */
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @Put('profile')
  async updateProfile(
    @Request() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(req.user.sub, updateUserDto);
  }

  /**
   * Change user password
   *
   * @param {RequestWithUser} req - Express request with user data
   * @param {ChangePasswordDto} changePasswordDto - Password change data
   * @returns {Promise<object>} Result of password change operation
   */
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid current password' })
  @HttpCode(HttpStatus.OK)
  @Put('password')
  async changePassword(
    @Request() req: RequestWithUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(
      req.user.sub,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }

  /**
   * Get user preferences
   *
   * @param {RequestWithUser} req - Express request with user data
   * @returns {Promise<any>} User preferences data
   */
  @ApiOperation({ summary: 'Get user preferences' })
  @ApiResponse({
    status: 200,
    description: 'Preferences retrieved successfully',
  })
  @Get('preferences')
  async getPreferences(@Request() req: RequestWithUser) {
    const user = await this.usersService.findById(req.user.sub);
    return user.settings;
  }
}
