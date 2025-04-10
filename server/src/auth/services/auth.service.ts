import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { User } from '../../database/entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../../database/entities/refresh-token.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

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
   * @param {JwtPayload} user - User data for JWT payload
   * @returns {Promise<{ accessToken: string; refreshToken: string }>} JWT tokens
   */
  async login(
    user: JwtPayload,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      sub: user.sub,
      email: user.email,
      role: user.role,
    };

    // Generate access token
    const accessToken = this.jwtService.sign(payload);

    // Generate refresh token
    const refreshToken = await this.generateRefreshToken(user.sub);

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
}
