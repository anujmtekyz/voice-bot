import { Controller, Get } from '@nestjs/common';
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
@Controller('api/system')
export class SystemController {
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
    return this.systemService.getHealth();
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
    return this.systemService.getVersion();
  }
}
