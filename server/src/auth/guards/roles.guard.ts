import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums/user-role.enum';
import { RequestWithUser } from '../interfaces/request-with-user.interface';

/**
 * Guard that enforces role-based access control
 *
 * @class RolesGuard
 * @implements {CanActivate}
 * Checks if the current user has the required roles to access a route
 */
@Injectable()
export class RolesGuard implements CanActivate {
  /**
   * Creates an instance of RolesGuard
   *
   * @param {Reflector} reflector - NestJS reflector for accessing route metadata
   */
  constructor(private reflector: Reflector) {}

  /**
   * Determines if the current request can proceed based on user roles
   *
   * @param {ExecutionContext} context - Current execution context
   * @returns {boolean} Whether the user has the required roles
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();

    // If no user is present in the request, deny access
    if (!request.user) {
      return false;
    }

    // Check if the user has any of the required roles
    return requiredRoles.some((role) => request.user.role === role);
  }
}
