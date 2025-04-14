import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '../../auth/enums/user-role.enum';
import { User } from '../entities/user.entity';
import { UserSettings } from '../entities/user-settings.entity';

export const seedAdminUser = async (dataSource: DataSource): Promise<void> => {
  const userRepository = dataSource.getRepository(User);
  const userSettingsRepository = dataSource.getRepository(UserSettings);

  // Check if admin user already exists
  const existingAdmin = await userRepository.findOne({
    where: { email: 'admin@example.com' },
  });

  if (existingAdmin) {
    console.log('Admin user already exists. Skipping admin user seed.');
    return;
  }

  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('AdminPassword123!', 10);

    const adminUser = userRepository.create({
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      isEmailVerified: true,
      isActive: true,
    });

    const savedUser = await userRepository.save(adminUser);
    console.log('Admin user created successfully.');

    // Create user settings for admin
    const adminSettings = userSettingsRepository.create({
      userId: savedUser.id,
      voiceActivation: true,
      voiceSensitivity: 0.7,
      language: 'en-US',
      theme: 'dark',
      notificationsEnabled: true,
      dailySummaryEnabled: true,
      customCommands: '[]',
      privacyMode: false,
    });

    await userSettingsRepository.save(adminSettings);
    console.log('Admin user settings created successfully.');

    // Create regular test user
    const testUserPassword = await bcrypt.hash('Password123!', 10);

    const testUser = userRepository.create({
      email: 'user@example.com',
      password: testUserPassword,
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.USER,
      isEmailVerified: true,
      isActive: true,
    });

    const savedTestUser = await userRepository.save(testUser);
    console.log('Test user created successfully.');

    // Create user settings for test user
    const testUserSettings = userSettingsRepository.create({
      userId: savedTestUser.id,
      voiceActivation: true,
      voiceSensitivity: 0.5,
      language: 'en-US',
      theme: 'light',
      notificationsEnabled: true,
      dailySummaryEnabled: false,
      customCommands: '[]',
      privacyMode: false,
    });

    await userSettingsRepository.save(testUserSettings);
    console.log('Test user settings created successfully.');

    console.log('Seed completed successfully.');
  } catch (error) {
    console.error('Error seeding admin user:', error);
    throw error;
  }
};
