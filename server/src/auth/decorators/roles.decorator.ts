import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum';

/**
 * Custom decorator for role-based authorization
 *
 * @param {...UserRole[]} roles - Roles allowed to access the endpoint
 * @returns {MethodDecorator} Decorator that sets metadata for role verification
 */
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
