import { Module, Global } from '@nestjs/common';

/**
 * Global module providing common services
 * This module is marked as global so its providers can be used
 * without importing the module in each consumer module
 */
@Global()
@Module({
  providers: [],
  exports: [],
})
export class CommonModule {}
