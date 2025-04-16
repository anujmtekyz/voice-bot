import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';

/**
 * Guard that enforces JWT authentication, allowing public routes via @Public decorator
 *
 * @class JwtAuthGuard
 * @extends {AuthGuard('jwt')}
 * Ensures a valid JWT token is present in the request unless marked as public
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Customizes the authentication handling
   *
   * @param {ExecutionContext} context - Current execution context
   * @returns {Promise<boolean>} Whether the request is authenticated or public
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    try {
      return (await super.canActivate(context)) as boolean;
    } catch (_error) {
      throw new UnauthorizedException(
        'Invalid or expired authentication token or missing permissions',
      );
    }
  }
}
