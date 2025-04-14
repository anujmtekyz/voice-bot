import { BadRequestException } from '@nestjs/common';

/**
 * Exception for validation errors.
 * Typically thrown by the ValidationPipe, but can be used manually.
 * Consider adding a property to hold detailed error structures if needed.
 */
export class ValidationAppException extends BadRequestException {
  constructor(message: string = 'Validation failed') {
    super(message);
  }
}
