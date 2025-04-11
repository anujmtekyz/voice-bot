import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RequestWithUser } from '../interfaces/request-with-user.interface';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

/**
 * Controller handling authentication operations
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  /**
   * Creates an instance of AuthController
   *
   * @param {AuthService} authService - Service handling authentication logic
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Authenticates a user and returns tokens
   *
   * @param {LoginDto} loginDto - User login credentials
   * @param {RequestWithUser} req - Express request with user data
   * @returns {Promise<object>} JWT access and refresh tokens
   */
  @ApiOperation({ summary: 'Authenticate user and get tokens' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Request() req: RequestWithUser) {
    return this.authService.login(req.user);
  }

  /**
   * Logout the user by revoking their refresh token
   *
   * @param {RefreshTokenDto} refreshTokenDto - Contains refresh token to revoke
   * @returns {Promise<{ success: boolean }>} Result of logout operation
   */
  @ApiOperation({ summary: 'Logout user and revoke token' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logout(refreshTokenDto.refreshToken);
  }

  /**
   * Retrieves the current authenticated user's information
   *
   * @param {RequestWithUser} req - Express request with user data
   * @returns {object} User data
   */
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }

  /**
   * Refreshes the access token using a valid refresh token
   *
   * @param {RefreshTokenDto} refreshTokenDto - Object containing refresh token
   * @returns {Promise<object>} New JWT access token
   */
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  /**
   * Initiates password reset process
   *
   * @param {ForgotPasswordDto} forgotPasswordDto - Contains user email
   * @returns {Promise<{ success: boolean; message: string }>} Status of reset request
   */
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset initiated' })
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  /**
   * Completes password reset with token and new password
   *
   * @param {ResetPasswordDto} resetPasswordDto - Contains token and new password
   * @returns {Promise<{ success: boolean; message: string }>} Result of reset operation
   */
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }
}
