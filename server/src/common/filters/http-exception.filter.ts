import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Global HTTP exception filter that formats all errors consistently
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  /**
   * Catches and formats HTTP exceptions
   * @param exception The exception object
   * @param host The arguments host
   */
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message || 'Internal server error',
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception.stack,
        'HttpExceptionFilter',
      );

      // Don't expose internal server errors in production
      if (process.env.NODE_ENV === 'production') {
        errorResponse.message = 'Internal server error';
      }
    } else {
      this.logger.warn(
        `${request.method} ${request.url}: ${exception.message}`,
      );
    }

    // Extract validation errors if available
    const exceptionResponse = exception.getResponse();
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const exceptionResponseObj = exceptionResponse as Record<string, unknown>;
      if ('errors' in exceptionResponseObj) {
        Object.assign(errorResponse, { errors: exceptionResponseObj.errors });
      } else if (
        'message' in exceptionResponseObj &&
        Array.isArray(exceptionResponseObj.message)
      ) {
        Object.assign(errorResponse, { errors: exceptionResponseObj.message });
      }
    }

    response.status(status).json(errorResponse);
  }
}
