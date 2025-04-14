import { ForbiddenException } from '@nestjs/common';

/**
 * Exception for authorization errors (e.g., user lacks permission for an action).
 */
export class AuthorizationAppException extends ForbiddenException {
  constructor(message: string = 'Permission denied') {
    super(message);
  }
}
