import { Module, Global } from '@nestjs/common';
import { LoggerService } from './services/logger.service';

/**
 * Global module providing common services
 * This module is marked as global so its providers can be used
 * without importing the module in each consumer module
 */
@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class CommonModule {}
