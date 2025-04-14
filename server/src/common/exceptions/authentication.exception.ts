import { UnauthorizedException } from '@nestjs/common';

/**
 * Exception for authentication errors (e.g., invalid credentials, missing token).
 */
export class AuthenticationAppException extends UnauthorizedException {
  constructor(message: string = 'Authentication required') {
    super(message);
  }
}
