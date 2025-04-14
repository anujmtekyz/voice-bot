import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Base class for custom application exceptions.
 * Consider extending this for specific domain errors not covered by standard HTTP exceptions.
 */
export class ApplicationException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(message, status);
  }
}
