import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Core modules
    ConfigModule,
    DatabaseModule,
    
    // Feature modules
    UsersModule,
    AuthModule,
    // Add more modules here as they are implemented
    // VoiceModule,
    // JiraModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 