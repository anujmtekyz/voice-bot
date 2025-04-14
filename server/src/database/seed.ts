import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import UserSeeder from './seeders/user.seeder';
import { User } from './entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { UserSettings } from './entities/user-settings.entity';
import { VoiceCommandHistory } from './entities/voice-command-history.entity';
import { Project } from './entities/project.entity';
import { Issue } from './entities/issue.entity';
import { Report } from './entities/report.entity';
import { Notification } from './entities/notification.entity';

// Load environment variables
config();

const configService = new ConfigService();

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [
    User,
    RefreshToken,
    UserSettings,
    VoiceCommandHistory,
    Project,
    Issue,
    Report,
    Notification,
  ],
  seeds: [UserSeeder],
};

const dataSource = new DataSource(options);

dataSource.initialize().then(async () => {
  await runSeeders(dataSource);
  console.log('Database seeding completed');
  process.exit();
});
