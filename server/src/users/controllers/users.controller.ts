import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/enums/user-role.enum';

/**
 * Controller handling user management operations
 */
@Controller('users')
export class UsersController {
  /**
   * Get basic user profile information
   * Accessible to any authenticated user
   *
   * @returns {object} User profile data
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getUserProfile() {
    return { message: 'This endpoint is accessible to any authenticated user' };
  }

  /**
   * Get all users in the system
   * Accessible only to administrators
   *
   * @returns {object} List of all users
   */
  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getAllUsers() {
    return { message: 'This endpoint is accessible only to administrators' };
  }

  /**
   * Get project management data
   * Accessible to project managers and administrators
   *
   * @returns {object} Project management data
   */
  @Get('projects')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROJECT_MANAGER, UserRole.ADMIN)
  getProjectData() {
    return {
      message:
        'This endpoint is accessible to project managers and administrators',
    };
  }
}
