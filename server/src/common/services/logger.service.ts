import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

/**
 * Custom logger service based on Winston
 */
@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;
  private context?: string;

  /**
   * Creates a new logger service
   * @param configService NestJS configuration service
   */
  constructor(private readonly configService: ConfigService) {
    const isProduction = this.configService.get('NODE_ENV') === 'production';

    // Define log formats
    const consoleFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message, context, trace }) => {
        return `${timestamp} [${context || 'Application'}] ${level}: ${message}${
          trace ? `\n${trace}` : ''
        }`;
      }),
    );

    const fileFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    );

    // Define transports
    const transports: winston.transport[] = [
      new winston.transports.Console({
        format: consoleFormat,
        level: isProduction ? 'info' : 'debug',
      }),
    ];

    // Add file rotation transport in production
    if (isProduction) {
      transports.push(
        new winston.transports.DailyRotateFile({
          format: fileFormat,
          dirname: 'logs',
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          level: 'info',
        }),
      );

      // Add separate error log
      transports.push(
        new winston.transports.DailyRotateFile({
          format: fileFormat,
          dirname: 'logs',
          filename: 'error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          level: 'error',
        }),
      );
    }

    // Create logger
    this.logger = winston.createLogger({
      level: isProduction ? 'info' : 'debug',
      transports,
    });
  }

  /**
   * Sets the context for the logger
   * @param context The context to use (typically class name)
   * @returns The logger instance
   */
  setContext(context: string): this {
    this.context = context;
    return this;
  }

  /**
   * Logs a debug message
   * @param message The message to log
   * @param context Optional context to override the default
   */
  debug(message: any, context?: string): void {
    this.logger.debug(this.formatMessage(message), {
      context: context || this.context,
    });
  }

  /**
   * Logs an info message
   * @param message The message to log
   * @param context Optional context to override the default
   */
  log(message: any, context?: string): void {
    this.logger.info(this.formatMessage(message), {
      context: context || this.context,
    });
  }

  /**
   * Logs a warning message
   * @param message The message to log
   * @param context Optional context to override the default
   */
  warn(message: any, context?: string): void {
    this.logger.warn(this.formatMessage(message), {
      context: context || this.context,
    });
  }

  /**
   * Logs an error message
   * @param message The message to log
   * @param trace Optional stack trace
   * @param context Optional context to override the default
   */
  error(message: any, trace?: string, context?: string): void {
    this.logger.error(this.formatMessage(message), {
      context: context || this.context,
      trace,
    });
  }

  /**
   * Formats a message object to a string if needed
   * @param message The message to format
   * @returns The formatted message
   */
  private formatMessage(message: any): string {
    if (typeof message === 'object') {
      return JSON.stringify(message);
    }
    return message;
  }
}
