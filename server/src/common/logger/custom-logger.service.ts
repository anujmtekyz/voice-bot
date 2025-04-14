import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as chalk from 'chalk';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  private readonly isProduction = process.env.NODE_ENV === 'production';

  // Override log method (INFO level)
  log(message: any, context?: string) {
    if (this.isProduction) {
      // In production, info logs are suppressed from console
      return;
    }
    // In development, log formatted message to console
    const formattedMessage = this._internalFormatMessage(
      'INFO',
      message,
      context,
    );
    super.log(formattedMessage, context);
  }

  // Override error method
  error(message: any, trace?: string, context?: string) {
    const jsonLog = this.formatJson('ERROR', message, context, trace);

    if (this.isProduction) {
      // Production: Log JSON to console
      console.error(jsonLog);
    } else {
      // Development: Beautified console log
      const prettyMessage = `${chalk.redBright('[ERROR]')} ${chalk.cyan(`[${context || this.context || 'Application'}]`)} ${chalk.red(message)}${
        trace ? `\n${chalk.grey(trace)}` : ''
      }`;
      super.error(prettyMessage);
    }
  }

  // Override warn method
  warn(message: any, context?: string) {
    const jsonLog = this.formatJson('WARN', message, context);

    if (this.isProduction) {
      // Production: Log JSON to console
      console.warn(jsonLog);
    } else {
      // Development: Beautified console log
      const prettyMessage = `${chalk.yellowBright('[WARN]')} ${chalk.cyan(`[${context || this.context || 'Application'}]`)} ${chalk.yellow(message)}`;
      super.warn(prettyMessage);
    }
  }

  // Override debug method
  debug(message: any, context?: string) {
    if (this.isProduction) {
      // Suppress debug logs in production entirely
      return;
    }
    // Development: Log pretty debug messages to console
    const prettyMessage = `${chalk.magentaBright('[DEBUG]')} ${chalk.cyan(`[${context || this.context || 'Application'}]`)} ${chalk.magenta(message)}`;
    super.debug(prettyMessage);
  }

  // Override verbose method
  verbose(message: any, context?: string) {
    if (this.isProduction) {
      // Suppress verbose logs in production entirely
      return;
    }
    // Development: Log pretty verbose messages to console
    const prettyMessage = `${chalk.blueBright('[VERBOSE]')} ${chalk.cyan(`[${context || this.context || 'Application'}]`)} ${chalk.blue(message)}`;
    super.verbose(prettyMessage);
  }

  // --- Helper Methods ---

  private _internalFormatMessage(
    level: string,
    message: any,
    context?: string,
    trace?: string,
  ): string {
    const pid = process.pid;
    const ctx = context || this.context || 'Application';
    const timestamp = new Date().toISOString();
    const base = `[${level}] ${pid} - ${timestamp} [${ctx}] ${message}`;
    return trace ? `${base}\n${trace}` : base;
  }

  private formatJson(
    level: string,
    message: any,
    context?: string,
    trace?: string,
  ): string {
    const logObject = {
      timestamp: new Date().toISOString(),
      level,
      pid: process.pid,
      context: context || this.context || 'Application',
      message:
        typeof message === 'object'
          ? JSON.stringify(message, null, 2)
          : message,
      trace: trace || undefined,
    };
    return JSON.stringify(logObject);
  }
}
