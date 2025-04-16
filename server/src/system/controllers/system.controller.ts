import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  SystemService,
  SystemHealth,
  SystemVersion,
} from '../services/system.service';

/**
 * Controller handling system-level endpoints
 */
@ApiTags('system')
@Controller('system')
export class SystemController {
  private readonly logger = new Logger(SystemController.name);

  /**
   * Creates an instance of SystemController
   * @param systemService Service providing system functionality
   */
  constructor(private readonly systemService: SystemService) {}

  /**
   * Get system health status
   * @returns System health information
   */
  @ApiOperation({ summary: 'Get system health status' })
  @ApiResponse({
    status: 200,
    description:
      'Returns system health information including database and service status',
  })
  @Get('status')
  getStatus(): SystemHealth {
    this.logger.log('Received request for system health status');
    try {
      const healthStatus = this.systemService.getHealth();
      this.logger.debug(
        `Returning health status: ${JSON.stringify(healthStatus)}`,
      );
      return healthStatus;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(
        `Error getting system health: ${err.message}`,
        err.stack,
      );
      throw err; // Let the exception filter handle this
    }
  }

  /**
   * Get system version information
   * @returns System version information
   */
  @ApiOperation({ summary: 'Get system version information' })
  @ApiResponse({
    status: 200,
    description: 'Returns system version and environment information',
  })
  @Get('version')
  getVersion(): SystemVersion {
    this.logger.log('Received request for system version information');
    try {
      const versionInfo = this.systemService.getVersion();
      this.logger.debug(
        `Returning version info: ${JSON.stringify(versionInfo)}`,
      );
      return versionInfo;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(
        `Error getting system version: ${err.message}`,
        err.stack,
      );
      throw err; // Let the exception filter handle this
    }
  }
}
