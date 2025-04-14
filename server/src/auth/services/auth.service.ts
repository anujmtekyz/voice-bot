import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { User } from '../../database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../../database/entities/refresh-token.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from '../../users/dto/create-user.dto';

/**
 * Service for handling authentication operations
 */
@Injectable()
export class AuthService {
  /**
   * Creates an instance of AuthService
   *
   * @param {UsersService} usersService - Service for user operations
   * @param {JwtService} jwtService - NestJS JWT service for token handling
   * @param {Repository<RefreshToken>} refreshTokenRepository - Repository for refresh tokens
   * @param {ConfigService} configService - NestJS config service
   */
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Register a new user
   *
   * @param {CreateUserDto} createUserDto - User registration data
   * @returns {Promise<{ user: User; accessToken: string; refreshToken: string }>} Created user and tokens
   */
  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    // Create the user
    const user = await this.usersService.create(createUserDto);

    // Generate tokens
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Validates user credentials
   *
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<User | null>} User if validated, null otherwise
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    return this.usersService.validateCredentials(email, password);
  }

  /**
   * Creates JWT tokens for authenticated user
   *
   * @param {any} user - User data
   * @returns {Promise<{ accessToken: string; refreshToken: string }>} JWT tokens
   */
  async login(
    user: any,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Generate access token
    const accessToken = this.jwtService.sign(payload);

    // Generate refresh token
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refreshes access token using valid refresh token
   *
   * @param {string} token - Refresh token
   * @returns {Promise<{ accessToken: string }>} New access token
   * @throws {UnauthorizedException} When refresh token is invalid or expired
   */
  async refreshToken(token: string): Promise<{ accessToken: string }> {
    const refreshTokenEntity = await this.refreshTokenRepository.findOne({
      where: { token, isRevoked: false },
      relations: ['user'],
    });

    if (!refreshTokenEntity || new Date() > refreshTokenEntity.expiresAt) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = refreshTokenEntity.user;
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  /**
   * Generates a new refresh token for a user
   *
   * @param {string} userId - User ID
   * @returns {Promise<string>} Generated refresh token
   */
  private async generateRefreshToken(userId: string): Promise<string> {
    // Generate a random token
    const tokenValue = await bcrypt.hash(Math.random().toString(), 10);

    // Calculate expiration (e.g., 7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Store the token in the database
    const refreshToken = this.refreshTokenRepository.create({
      userId,
      token: tokenValue,
      expiresAt,
    });

    await this.refreshTokenRepository.save(refreshToken);

    return tokenValue;
  }

  /**
   * Revokes a refresh token (logout)
   *
   * @param {string} token - Refresh token to revoke
   * @returns {Promise<{ success: boolean }>} Result of logout operation
   */
  async logout(token: string): Promise<{ success: boolean }> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token },
    });

    if (!refreshToken) {
      return { success: true }; // Token doesn't exist, consider it already logged out
    }

    // Mark the token as revoked
    refreshToken.isRevoked = true;
    await this.refreshTokenRepository.save(refreshToken);

    return { success: true };
  }

  /**
   * Initiates password reset process
   *
   * @param {string} email - User's email
   * @returns {Promise<{ success: boolean; message: string }>} Result of reset request
   */
  async forgotPassword(
    email: string,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      // Don't reveal if the email exists for security reasons
      return {
        success: true,
        message:
          'If your email is registered, you will receive a password reset link',
      };
    }

    // Generate a reset token
    const resetToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiration

    // Store the reset token (in a real app, would be in a dedicated table)
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = expiresAt;
    await this.usersService.update(user.id, user);

    // In a real app, would send an email with the reset link
    // For development, just return the token
    return {
      success: true,
      message:
        'Password reset initiated. In production, an email would be sent.',
    };
  }

  /**
   * Completes the password reset process
   *
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<{ success: boolean; message: string }>} Result of reset operation
   */
  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.usersService.findByResetToken(token);

    if (
      !user ||
      !user.passwordResetExpires ||
      user.passwordResetExpires < new Date()
    ) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Update the password and clear reset token
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.update(user.id, {
      password: hashedPassword,
      passwordResetToken: '',
      passwordResetExpires: null as any,
    });

    // Revoke all refresh tokens for security
    await this.refreshTokenRepository.update(
      { userId: user.id, isRevoked: false },
      { isRevoked: true },
    );

    return {
      success: true,
      message: 'Password has been successfully reset',
    };
  }

  /**
   * Tracks failed login attempts and handles account lockout
   *
   * @param {string} email - User's email
   * @param {boolean} success - Whether the login was successful
   */
  async trackLoginAttempt(email: string, success: boolean): Promise<void> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return; // User doesn't exist, nothing to track
    }

    if (success) {
      // Reset failed attempts on successful login
      user.failedLoginAttempts = 0;
      user.lastLoginAt = new Date();
      await this.usersService.update(user.id, user);
      return;
    }

    // Increment failed attempts
    user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

    // Lock account after 5 failed attempts
    if (user.failedLoginAttempts >= 5) {
      user.accountLocked = true;
      user.lockExpiresAt = new Date();
      user.lockExpiresAt.setMinutes(user.lockExpiresAt.getMinutes() + 30); // 30 minute lockout
    }

    await this.usersService.update(user.id, user);
  }
}
