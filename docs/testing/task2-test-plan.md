# Task 2: Authentication and User Management Test Plan

This document outlines the manual testing procedures to validate the implementation of Task 2 (Authentication and User Management) for the JIRA Voice Bot application.

## Prerequisites

- Backend and frontend services are running
- Database is properly initialized with migrations
- Test user accounts are available (or can be created during testing)

## Test Credentials

- Regular User:
  - Email: `user@example.com`
  - Password: `Password123!`

- Admin User:
  - Email: `admin@example.com`
  - Password: `AdminPassword123!`

## Test Cases

### 1. User Registration

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|----------------|
| REG-01 | Register a new user | 1. Navigate to `/register`<br>2. Fill all required fields<br>3. Submit the form | User is registered and redirected to login page with success message |
| REG-02 | Attempt registration with existing email | 1. Navigate to `/register`<br>2. Fill form with an email that already exists<br>3. Submit the form | Registration fails with appropriate error message |
| REG-03 | Attempt registration with invalid data | 1. Navigate to `/register`<br>2. Submit form with invalid password format<br>3. Submit the form | Form validation displays appropriate errors |

### 2. User Login

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|----------------|
| LOGIN-01 | Login with valid credentials | 1. Navigate to `/login`<br>2. Enter valid email and password<br>3. Click Login | User is logged in and redirected to dashboard |
| LOGIN-02 | Login with invalid credentials | 1. Navigate to `/login`<br>2. Enter invalid email or password<br>3. Click Login | Login fails with appropriate error message |
| LOGIN-03 | Account lockout after failed attempts | 1. Navigate to `/login`<br>2. Enter valid email but incorrect password multiple times<br>3. Attempt login again | Account is locked after a pre-defined number of attempts |

### 3. Password Management

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|----------------|
| PASS-01 | Forgot password flow | 1. Navigate to `/forgot-password`<br>2. Enter email<br>3. Submit the form | Success message indicating reset instructions have been sent |
| PASS-02 | Reset password with valid token | 1. Navigate to `/reset-password?token=[valid-token]`<br>2. Enter new password<br>3. Submit the form | Password is updated successfully and user can login with new password |
| PASS-03 | Reset password with invalid token | 1. Navigate to `/reset-password?token=[invalid-token]`<br>2. Enter new password<br>3. Submit the form | Error message indicating invalid or expired token |

### 4. Authentication State

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|----------------|
| AUTH-01 | Persistence of login state | 1. Login to the application<br>2. Refresh the browser | User remains logged in |
| AUTH-02 | Logout functionality | 1. Login to the application<br>2. Click on logout button | User is logged out and redirected to login page |
| AUTH-03 | Access to protected routes | 1. Without logging in, try to access `/dashboard` | User is redirected to login page |

### 5. Token Management

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|----------------|
| TOKEN-01 | Token refresh | 1. Login to the application<br>2. Wait until access token expires<br>3. Perform an action requiring authentication | Token is refreshed automatically and request succeeds |
| TOKEN-02 | Logout revokes tokens | 1. Login to the application<br>2. Logout<br>3. Try to use the application with the old token | All requests fail with authentication errors |

### 6. Role-Based Access Control

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|----------------|
| RBAC-01 | Access to role-restricted routes as authorized user | 1. Login as admin<br>2. Navigate to `/admin` | Admin can access the admin page |
| RBAC-02 | Access to role-restricted routes as unauthorized user | 1. Login as regular user<br>2. Try to navigate to `/admin` | User is redirected to unauthorized page |
| RBAC-03 | API endpoints with role restrictions | 1. Login as regular user<br>2. Make API request to admin-only endpoint | Request is rejected with 403 Forbidden |

### 7. Security Features

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|----------------|
| SEC-01 | Password is not returned in user data | 1. Login to the application<br>2. Check browser network tab for user data responses | Password field is not included in any responses |
| SEC-02 | Sensitive cookies security | 1. Login to the application<br>2. Check browser cookies | Auth cookies have HttpOnly, Secure, and SameSite attributes |
| SEC-03 | Account lockout reset | 1. Lock an account with multiple failed attempts<br>2. Wait for the lockout period to expire<br>3. Try to login with correct credentials | User can login after the lockout period |

## Test Execution Checklist

- [ ] All Registration tests passed
- [ ] All Login tests passed
- [ ] All Password Management tests passed
- [ ] All Authentication State tests passed
- [ ] All Token Management tests passed
- [ ] All Role-Based Access Control tests passed
- [ ] All Security Features tests passed

## Notes

- Document any unexpected behavior or bugs found during testing
- For any security-related issues, document the severity and potential impact
- Note any areas that may need additional testing or improvements 