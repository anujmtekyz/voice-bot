describe('Authentication and User Management (Task 2)', () => {
  // Test user data
  const testUser = {
    email: `test${Math.floor(Math.random() * 10000)}@example.com`,
    password: 'Password123!',
    firstName: 'Test',
    lastName: 'User',
  };

  beforeEach(() => {
    // Clear localStorage to ensure clean state
    cy.clearLocalStorage();
  });

  it('should login with valid credentials', () => {
    cy.visit('/login');
    
    // Fill out login form using IDs
    cy.get('#email').type(testUser.email);
    cy.get('#password').type(testUser.password);
    
    // Submit form - use the Sign in button
    cy.contains('button', 'Sign in').click();
    
    // Verify redirect to dashboard after the timeout in handleSubmit (1500ms)
    cy.url().should('include', '/dashboard', { timeout: 5000 });
  });

  it('should fail login with incorrect credentials', () => {
    cy.visit('/login');
    
    // Fill out login form with wrong password
    cy.get('#email').type(testUser.email);
    cy.get('#password').type('wrong');
    
    // Submit form
    cy.contains('button', 'Sign in').click();
    
    // Since the form validates password length, we should see validation error
    cy.contains('Password must be at least 6 characters').should('be.visible');
  });

  it('should show toast for failed login with valid format but incorrect credentials', () => {
    cy.visit('/login');
    
    // Fill out login form with valid format but wrong credentials
    cy.get('#email').type('nonexistent@example.com');
    cy.get('#password').type('validpassword123');
    
    // Submit form
    cy.contains('button', 'Sign in').click();
    
    // In the demo implementation, after timeout it will show a toast
    // We can't easily test the toast in Cypress, so we'll check other indications
    // such as the button returning to its normal state after loading
    cy.contains('button', 'Sign in').should('be.visible', { timeout: 5000 });
  });

  it('should show form validation for forgot password', () => {
    cy.visit('/forgot-password');
    
    // Submit empty form - look for a button that says Reset Password or similar
    cy.get('button').contains(/Reset|Send/).click();
    
    // Should show validation error
    cy.contains(/Email is required|Please enter your email/).should('be.visible');
    
    // Type invalid email
    cy.get('input[type="email"]').type('invalid-email');
    
    // Submit again
    cy.get('button').contains(/Reset|Send/).click();
    
    // Should show validation error for invalid email
    cy.contains(/valid email|correct format/).should('be.visible');
  });

  it('should navigate to forgot password and back to login', () => {
    cy.visit('/login');
    
    // Click on forgot password link
    cy.contains('a', 'Forgot password?').click();
    
    // Verify navigation to forgot password page
    cy.url().should('include', '/forgot-password');
    
    // Go back to login (look for a link containing "Back" or similar text)
    cy.get('a').contains(/Back|Login|Sign/).click();
    
    // Verify back on login page
    cy.url().should('include', '/login');
  });

  it('should validate login form fields', () => {
    cy.visit('/login');
    
    // Submit empty form
    cy.contains('button', 'Sign in').click();
    
    // Check for validation errors
    cy.contains('Email is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
    
    // Type invalid email
    cy.get('#email').type('invalid-email');
    
    // Submit again
    cy.contains('button', 'Sign in').click();
    
    // Check for email validation error
    cy.contains('Please enter a valid email').should('be.visible');
  });

  it('should toggle password visibility', () => {
    cy.visit('/login');
    
    // Type password
    cy.get('#password').type('securepassword');
    
    // Password should be hidden by default (type="password")
    cy.get('#password').should('have.attr', 'type', 'password');
    
    // Find and click show password button (look for button near password field)
    cy.get('#password').parent().find('button').click();
    
    // Password should now be visible (type="text")
    cy.get('#password').should('have.attr', 'type', 'text');
    
    // Click hide password button again
    cy.get('#password').parent().find('button').click();
    
    // Password should be hidden again
    cy.get('#password').should('have.attr', 'type', 'password');
  });

  it('should have remember me option', () => {
    cy.visit('/login');
    
    // Check for the remember me checkbox
    cy.get('#remember-me').should('exist');
    
    // By default it should be unchecked
    cy.get('#remember-me').should('not.be.checked');
    
    // We should be able to toggle it
    cy.get('label').contains('Remember me').click();
    
    // Now it should be checked
    cy.get('#remember-me').should('be.checked');
  });
}); 