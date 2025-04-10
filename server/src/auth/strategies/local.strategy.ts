import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';

/**
 * Local authentication strategy for passport
 *
 * @class LocalStrategy
 * @extends PassportStrategy
 * Validates user credentials using username/password
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * Creates an instance of LocalStrategy
   *
   * @param {AuthService} authService - Service to validate user credentials
   */
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  /**
   * Validates user credentials and returns the user if valid
   *
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<any>} Authenticated user data
   * @throws {UnauthorizedException} When credentials are invalid
   */
  async validate(email: string, password: string): Promise<any> {
    // Type assertion is needed until proper types are implemented
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
