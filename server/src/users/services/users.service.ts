import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../dto/create-user.dto';

/**
 * Service for managing user operations
 */
@Injectable()
export class UsersService {
  /**
   * Creates an instance of UsersService
   *
   * @param {Repository<User>} userRepository - TypeORM repository for users
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Find user by ID
   *
   * @param {string} id - User ID
   * @returns {Promise<User>} User entity
   * @throws {NotFoundException} If user not found
   */
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Find user by email
   *
   * @param {string} email - User email
   * @returns {Promise<User | null>} User entity or null if not found
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  /**
   * Find user by password reset token
   *
   * @param {string} token - Reset token
   * @returns {Promise<User | null>} User entity or null if not found
   */
  async findByResetToken(token: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { passwordResetToken: token },
    });
  }

  /**
   * Create a new user
   *
   * @param {CreateUserDto} createUserDto - User data
   * @returns {Promise<User>} Created user
   * @throws {ConflictException} If email already exists
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  /**
   * Update user information
   *
   * @param {string} id - User ID
   * @param {UpdateUserDto} updateUserDto - Updated user data
   * @returns {Promise<User>} Updated user
   * @throws {NotFoundException} If user not found
   */
  async update(id: string, updateUserDto: Partial<User>): Promise<User> {
    const user = await this.findById(id);

    // If updating password, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  /**
   * Delete a user
   *
   * @param {string} id - User ID
   * @returns {Promise<void>}
   * @throws {NotFoundException} If user not found
   */
  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
  }

  /**
   * Validate user credentials
   *
   * @param {string} email - User email
   * @param {string} password - Password to validate
   * @returns {Promise<User | null>} User if credentials valid, null otherwise
   */
  async validateCredentials(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.findByEmail(email);

    if (!user) {
      return null;
    }

    // Check if account is locked
    if (user.accountLocked) {
      // Check if lock has expired
      if (user.lockExpiresAt && user.lockExpiresAt < new Date()) {
        // Reset lock if expired
        user.accountLocked = false;
        user.failedLoginAttempts = 0;
        await this.userRepository.save(user);
      } else {
        return null; // Account still locked
      }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  /**
   * Get user profile information
   *
   * @param {string} id - User ID
   * @returns {Promise<Partial<User>>} User profile data
   */
  async getProfile(id: string): Promise<Partial<User>> {
    const user = await this.findById(id);

    // Return only safe user data - prefix unused variables with underscore
    const {
      password: _password,
      passwordResetToken: _passwordResetToken,
      passwordResetExpires: _passwordResetExpires,
      ...userProfile
    } = user;
    return userProfile;
  }

  /**
   * Change user password
   *
   * @param {string} id - User ID
   * @param {string} currentPassword - Current password for verification
   * @param {string} newPassword - New password
   * @returns {Promise<{ success: boolean }>} Operation result
   */
  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean }> {
    const user = await this.findById(id);

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      return { success: false };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await this.userRepository.save(user);
    return { success: true };
  }

  /**
   * Find all users with pagination
   *
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<{ users: User[]; total: number; page: number; limit: number }>} Paginated users list
   */
  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ users: User[]; total: number; page: number; limit: number }> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      users,
      total,
      page,
      limit,
    };
  }
}
