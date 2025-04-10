import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RequestWithUser } from '../interfaces/request-with-user.interface';
import { LoginDto } from '../dto/login.dto';

/**
 * Controller handling authentication operations
 */
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
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Request() req: RequestWithUser) {
    return this.authService.login(req.user);
  }

  /**
   * Retrieves the current authenticated user's information
   *
   * @param {RequestWithUser} req - Express request with user data
   * @returns {object} User data
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }

  /**
   * Refreshes the access token using a valid refresh token
   *
   * @param {object} refreshTokenDto - Object containing refresh token
   * @returns {Promise<object>} New JWT access token
   */
  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: { refreshToken: string }) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
}
