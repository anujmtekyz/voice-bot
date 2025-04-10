import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard that enforces JWT authentication
 *
 * @class JwtAuthGuard
 * @extends {AuthGuard('jwt')}
 * Ensures a valid JWT token is present in the request
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Customizes the authentication handling
   *
   * @param {ExecutionContext} context - Current execution context
   * @returns {Promise<boolean>} Whether the request is authenticated
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Call the parent method to perform JWT authentication
      return (await super.canActivate(context)) as boolean;
    } catch (_error) {
      // Ignoring the specific error but throwing a standardized unauthorized exception
      throw new UnauthorizedException(
        'Invalid or expired authentication token',
      );
    }
  }
}
