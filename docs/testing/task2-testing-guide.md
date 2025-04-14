# Task 2 Testing Guide: Authentication and User Management

This guide explains how to run and validate the Task 2 implementation (Authentication and User Management) for the JIRA Voice Bot application.

## Overview

Task 2 implementation includes:

- JWT-based authentication
- User management functionality
- Role-based authorization
- Password reset flow
- Account lockout after failed attempts
- Token refresh mechanism
- Security enhancements

## Automated Testing

We've created both unit tests and end-to-end tests to verify the functionality of the authentication system.

### Running E2E Tests

The end-to-end tests use Cypress to validate the complete authentication flow from user perspective.

```bash
# Run the automated end-to-end test script
./scripts/run-auth-tests.sh
```

This script will:
1. Start required database containers with Docker Compose
2. Build and start the backend server
3. Build and start the frontend application
4. Run the Cypress tests
5. Clean up resources when done

### What's Being Tested

The E2E tests validate:

1. User registration
2. Login with valid credentials
3. Failed login with incorrect credentials
4. Account lockout after multiple failed login attempts
5. Password reset functionality
6. Role-based access control
7. Automatic token refresh
8. Successful logout

## Manual Testing

For detailed manual testing, refer to the [Task 2 Test Plan](./task2-test-plan.md) document. The test plan includes:

1. Comprehensive test cases
2. Step-by-step instructions
3. Expected results for each test case
4. Test execution checklist

### Manual Testing Prerequisites

1. Make sure the application is running:

```bash
# Start database containers
cd server
docker-compose up -d postgres redis
cd ..

# Start backend
cd server
pnpm run start:dev
cd ..

# In a separate terminal, start frontend
pnpm run dev
```

2. Create test accounts or use existing ones
3. Use the browser development tools to inspect network requests and cookies

## Troubleshooting

### Common Issues

1. **Tests failing with authentication errors**: 
   - Ensure the JWT secret is correctly set in environment variables
   - Check the token expiration settings

2. **Account lockout issues**:
   - The default lockout is set to 5 failed attempts
   - Reset the account via the database or wait for the lockout period

3. **Database connection errors**:
   - Ensure Docker is running and the database containers are healthy
   - Check the database connection settings in the `.env` file

### Logs and Debugging

- Backend logs are available in the terminal where the server is running
- Frontend console logs can be viewed in browser developer tools
- Cypress test videos are saved in the `cypress/videos` directory

## Security Considerations

When testing authentication features, keep in mind:

1. Never test with production credentials
2. Ensure tests are run in a secure, isolated environment
3. Be aware that failed login tests might trigger real security mechanisms

## Additional Notes

- For full coverage, combine both automated and manual testing
- Report any security issues immediately
- Document any unexpected behaviors or potential improvements 