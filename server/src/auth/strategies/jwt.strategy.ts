import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/services/users.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * JWT strategy for passport authentication
 *
 * @class JwtStrategy
 * @extends PassportStrategy
 * Validates JWT tokens and loads the user entity
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Creates an instance of JwtStrategy
   *
   * @param {ConfigService} configService - NestJS config service for accessing environment variables
   * @param {UsersService} usersService - Service to retrieve and validate user data
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const secret = configService.get<string>('jwt.secret');
    if (!secret) {
      throw new Error('JWT secret is not defined in configuration');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  /**
   * Validates the JWT payload and returns the user data
   *
   * @param {JwtPayload} payload - Decoded JWT payload containing user information
   * @returns {Promise<object>} User data object
   * @throws {UnauthorizedException} When user does not exist or is inactive
   */
  async validate(
    payload: JwtPayload,
  ): Promise<{ id: string; email: string; role: string }> {
    const user = await this.usersService.findById(payload.sub);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
