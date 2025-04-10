import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import * as bcrypt from 'bcrypt';

/**
 * Service for user management operations
 */
@Injectable()
export class UsersService {
  /**
   * Creates an instance of UsersService
   *
   * @param {Repository<User>} usersRepository - TypeORM repository for users
   */
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Find a user by ID
   *
   * @param {string} id - User ID
   * @returns {Promise<User>} The found user
   * @throws {NotFoundException} When user is not found
   */
  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Find a user by email
   *
   * @param {string} email - User email
   * @returns {Promise<User>} The found user
   */
  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  /**
   * Validate user credentials
   *
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<User | null>} User if validated, null otherwise
   */
  async validateCredentials(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}
