import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum';

/**
 * Key for roles metadata
 */
export const ROLES_KEY = 'roles';

/**
 * Decorator to specify which roles have access to a route
 *
 * @param {...UserRole[]} roles - Roles that can access this route
 * @returns {MethodDecorator & ClassDecorator} Decorator function
 *
 * @example
 * @Roles(UserRole.ADMIN)
 * @Get('admin-only')
 * getAdminData() { ... }
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
