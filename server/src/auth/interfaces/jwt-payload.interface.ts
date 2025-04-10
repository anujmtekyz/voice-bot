import { UserRole } from '../enums/user-role.enum';

/**
 * Interface representing the decoded JWT token payload
 */
export interface JwtPayload {
  /**
   * User's unique identifier
   */
  sub: string;

  /**
   * User's email address
   */
  email: string;

  /**
   * User's role for authorization
   */
  role: UserRole;

  /**
   * Token issued at timestamp
   */
  iat?: number;

  /**
   * Token expiration timestamp
   */
  exp?: number;
}
