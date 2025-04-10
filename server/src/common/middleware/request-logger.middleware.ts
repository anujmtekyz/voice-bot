import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../services/logger.service';

/**
 * Middleware for logging HTTP requests
 */
@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext('HTTP');
  }

  /**
   * Process the incoming request and log it
   * @param request Express request object
   * @param response Express response object
   * @param next Next function to continue processing
   */
  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = request;
    const userAgent = request.get('user-agent') || '';

    // Log request details
    this.logger.log(`${method} ${originalUrl} - ${ip} - ${userAgent}`);

    // Track response time
    const startTime = Date.now();

    // Log response after it's sent
    response.on('finish', () => {
      const responseTime = Date.now() - startTime;
      const { statusCode } = response;

      if (statusCode >= 500) {
        this.logger.error(
          `${method} ${originalUrl} ${statusCode} - ${responseTime}ms`,
        );
      } else if (statusCode >= 400) {
        this.logger.warn(
          `${method} ${originalUrl} ${statusCode} - ${responseTime}ms`,
        );
      } else {
        this.logger.log(
          `${method} ${originalUrl} ${statusCode} - ${responseTime}ms`,
        );
      }
    });

    next();
  }
}
