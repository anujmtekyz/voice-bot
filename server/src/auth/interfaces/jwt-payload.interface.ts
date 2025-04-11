/**
 * Interface for JWT token payload
 */
export interface JwtPayload {
  /**
   * User ID (subject)
   */
  sub: string;

  /**
   * User email
   */
  email: string;

  /**
   * User role
   */
  role: string;

  /**
   * Token issue date
   */
  iat?: number;

  /**
   * Token expiration date
   */
  exp?: number;
}
