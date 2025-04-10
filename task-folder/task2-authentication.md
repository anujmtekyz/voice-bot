# Task 2: Authentication and User Management

This task focuses on implementing authentication, user management functionality, and security features for the JIRA Voice Bot application.

## Objectives
- Implement JWT-based authentication system
- Create user management functionality
- Set up role-based authorization
- Configure user profile and preferences management

## Subtasks

### 2.1 User Entity and Repository
- [ ] Create User entity with proper fields
  - [ ] Email, name, password (hashed), role, status fields
  - [ ] Created/updated timestamps
  - [ ] Last login tracking
- [ ] Implement UserRepository with TypeORM
- [ ] Create database migrations for user table
- [ ] Add password hashing with bcrypt
- [ ] Implement user data validation
- [ ] Add unique constraint enforcement

### 2.2 User Service and DTOs
- [ ] Create UserService with CRUD operations
  - [ ] findById, findByEmail, create, update, delete methods
  - [ ] User activation/deactivation logic
  - [ ] Password change functionality
- [ ] Define DTOs for user operations
  - [ ] CreateUserDto with validation
  - [ ] UpdateUserDto with validation
  - [ ] UserResponseDto for API responses
- [ ] Implement user profile management functionality
- [ ] Add user preferences storage and retrieval

### 2.3 JWT Authentication
- [ ] Configure JWT module with environment variables
- [ ] Create JWT strategy for Passport
- [ ] Implement token generation and validation
- [ ] Set up access token (short-lived) functionality
- [ ] Configure refresh token (long-lived) functionality
- [ ] Add token blacklisting for logout
- [ ] Implement JWT expiration handling

### 2.4 Authentication Service
- [ ] Create AuthService with login functionality
- [ ] Implement registration flow
- [ ] Add refresh token mechanism
- [ ] Create password reset functionality
  - [ ] Generate reset tokens
  - [ ] Send reset emails (mock for development)
  - [ ] Process reset requests
- [ ] Add last login tracking
- [ ] Implement account lockout after failed attempts

### 2.5 Role-Based Authorization
- [ ] Define role enum (User, Admin, Project Manager)
- [ ] Create role guard for protecting routes
- [ ] Implement role decorator for controllers/methods
- [ ] Set up permission checking logic
- [ ] Add role assignment functionality
- [ ] Create admin-only routes protection

### 2.6 Authentication Controllers
- [ ] Implement AuthController with endpoints
  - [ ] POST /api/auth/login - User login
  - [ ] POST /api/auth/logout - User logout
  - [ ] POST /api/auth/refresh-token - Refresh token
  - [ ] POST /api/auth/forgot-password - Request reset
  - [ ] POST /api/auth/reset-password - Process reset
  - [ ] GET /api/auth/me - Get current user
- [ ] Create Swagger documentation for auth endpoints
- [ ] Implement validation for all request bodies
- [ ] Add rate limiting for sensitive endpoints

### 2.7 User Management Controllers
- [ ] Create UserController with endpoints
  - [ ] GET /api/users/profile - Get user profile
  - [ ] PUT /api/users/profile - Update profile
  - [ ] PUT /api/users/password - Change password
  - [ ] GET /api/users/preferences - Get preferences
  - [ ] PUT /api/users/preferences - Update preferences
- [ ] Implement AdminUserController for admin operations
  - [ ] GET /api/admin/users - List all users
  - [ ] POST /api/admin/users - Create user
  - [ ] PUT /api/admin/users/:id - Update user
  - [ ] DELETE /api/admin/users/:id - Delete user
- [ ] Add proper authorization checks to all routes
- [ ] Create Swagger documentation for endpoints

### 2.8 Security Enhancements
- [ ] Implement CORS configuration
- [ ] Add rate limiting for authentication endpoints
- [ ] Configure Content Security Policy
- [ ] Set up XSS protection
- [ ] Implement Helmet security headers
- [ ] Add request validation for all endpoints
- [ ] Create security testing suite

## API Endpoints To Be Implemented:

```
# Authentication APIs
POST /api/auth/login - User login with email/password
POST /api/auth/logout - User logout
POST /api/auth/refresh-token - Refresh authentication token
POST /api/auth/forgot-password - Initiate password reset
POST /api/auth/reset-password - Complete password reset with token
GET /api/auth/me - Get current user information

# User Management APIs
GET /api/users/profile - Get user profile information
PUT /api/users/profile - Update user profile information
PUT /api/users/password - Change user password
GET /api/users/preferences - Get user preferences
PUT /api/users/preferences - Update user preferences

# Admin User Management APIs
GET /api/admin/users - List all users (admin only)
POST /api/admin/users - Create new user (admin only)
PUT /api/admin/users/:id - Update user (admin only)
DELETE /api/admin/users/:id - Delete user (admin only)
```

## Verification Criteria
- All authentication endpoints work as expected
- JWT tokens are issued and validated correctly
- User registration and login flows are functional
- Password reset functionality works end-to-end
- User profiles can be retrieved and updated
- Role-based authorization correctly restricts access
- Admin can manage users through dedicated endpoints
- All security features are properly implemented

## Dependencies
- Task 1: Core Infrastructure Setup
- NestJS Passport integration
- JWT knowledge
- Security best practices
- Understanding of API requirements document

## Estimated Time
- 3-4 days 