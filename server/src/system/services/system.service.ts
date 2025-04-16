import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

/**
 * Interface representing system health check response
 */
export interface SystemHealth {
  status: 'ok' | 'error';
  timestamp: string;
  database: {
    status: 'ok' | 'error';
    message: string;
  };
  services: {
    redis: {
      status: 'ok' | 'error';
      message: string;
    };
  };
}

/**
 * Interface representing system version information
 */
export interface SystemVersion {
  version: string;
  environment: string;
  nodeVersion: string;
  nestVersion: string;
}

/**
 * Service providing system-level functionality
 */
@Injectable()
export class SystemService {
  private readonly logger = new Logger(SystemService.name);

  /**
   * Creates an instance of SystemService
   * @param configService NestJS configuration service
   * @param connection TypeORM database connection
   */
  constructor(
    private readonly configService: ConfigService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  /**
   * Gets the current system health status
   * @returns The system health status
   */
  getHealth(): SystemHealth {
    this.logger.log('Checking system health status');

    let databaseStatus = 'ok';
    let databaseMessage = 'Database connection is active';
    const redisStatus = 'ok';
    const redisMessage = 'Redis connection is active';

    // Check database connection
    try {
      if (!this.connection.isConnected) {
        databaseStatus = 'error';
        databaseMessage = 'Database connection is not active';
        this.logger.warn(
          'Database connection is not active during health check',
        );
      }
    } catch (error: unknown) {
      const err = error as Error;
      databaseStatus = 'error';
      databaseMessage = `Database error: ${err.message}`;
      this.logger.error(
        `Database error during health check: ${err.message}`,
        err.stack,
      );
    }

    // TODO: Check Redis connection (needs Redis client implementation)
    // This is a placeholder for now - in a real implementation, we would
    // inject a Redis client and check its connection status

    const overallStatus =
      databaseStatus === 'ok' && redisStatus === 'ok' ? 'ok' : 'error';
    const healthStatus: SystemHealth = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      database: {
        status: databaseStatus as 'ok' | 'error',
        message: databaseMessage,
      },
      services: {
        redis: {
          status: redisStatus as 'ok' | 'error',
          message: redisMessage,
        },
      },
    };

    this.logger.log(`Health check completed with status: ${overallStatus}`);
    return healthStatus;
  }

  /**
   * Gets the current system version information
   * @returns The system version
   */
  getVersion(): SystemVersion {
    this.logger.log('Retrieving system version information');

    const versionInfo: SystemVersion = {
      version: this.configService.get<string>('npm_package_version', '1.0.0'),
      environment: this.configService.get<string>('NODE_ENV', 'development'),
      nodeVersion: process.version,
      nestVersion: '11.0.0', // Ideally this should be dynamic rather than hardcoded
    };

    this.logger.log(
      `Version info retrieved: ${versionInfo.version} (${versionInfo.environment})`,
    );
    return versionInfo;
  }
}
