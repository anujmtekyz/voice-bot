import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../entities/user.entity';
import { UserRole } from '../../auth/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userRepository = dataSource.getRepository(User);

    // Create test users
    const users = [
      {
        email: 'user@example.com',
        password: await bcrypt.hash('UserPassword123!', 10),
        role: UserRole.USER,
        firstName: 'Test',
        lastName: 'User',
        isEmailVerified: true,
        isActive: true,
      },
      {
        email: 'admin@example.com',
        password: await bcrypt.hash('AdminPassword123!', 10),
        role: UserRole.ADMIN,
        firstName: 'Test',
        lastName: 'Admin',
        isEmailVerified: true,
        isActive: true,
      },
    ];

    for (const userData of users) {
      const existingUser = await userRepository.findOne({
        where: { email: userData.email },
      });

      if (!existingUser) {
        const user = userRepository.create(userData);
        await userRepository.save(user);
      }
    }
  }
}
