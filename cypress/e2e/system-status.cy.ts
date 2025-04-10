describe('System Status Component', () => {
  beforeEach(() => {
    // Visit the dashboard page where the system status component is located
    cy.visit('/dashboard');
    
    // Wait for the page to load
    cy.contains('Dashboard').should('be.visible');
  });

  it('should display the system status component with data', () => {
    // Initially we might see a loading state
    cy.get('[data-cy=system-status-loading]').should('not.exist');
    
    // The component should be visible after loading
    cy.get('[data-cy=system-status]').should('be.visible');
    
    // System Health section should be visible with all elements
    cy.get('[data-cy=system-health-section]').within(() => {
      cy.contains('System Health').should('be.visible');
      
      // Overall status should show as operational
      cy.get('[data-cy=overall-status]').should('be.visible');
      cy.get('[data-cy=status-operational]').should('be.visible');
      
      // Database status should be visible and operational
      cy.get('[data-cy=database-status]').should('be.visible');
      cy.get('[data-cy=database-message]').should('contain', 'Database connection is active');
      
      // Redis status should be visible and operational
      cy.get('[data-cy=redis-status]').should('be.visible');
      cy.get('[data-cy=redis-message]').should('contain', 'Redis connection is active');
    });
    
    // Version section should be visible with all elements
    cy.get('[data-cy=version-section]').within(() => {
      cy.contains('Version Information').should('be.visible');
      
      // App version should be visible
      cy.get('[data-cy=app-version]').should('be.visible');
      cy.get('[data-cy=app-version]').should('not.contain', 'N/A');
      
      // Environment should be visible
      cy.get('[data-cy=environment]').should('be.visible');
      cy.get('[data-cy=environment]').should('not.contain', 'N/A');
      
      // Node version should be visible
      cy.get('[data-cy=node-version]').should('be.visible');
      cy.get('[data-cy=node-version]').should('not.contain', 'N/A');
      
      // NestJS version should be visible
      cy.get('[data-cy=nest-version]').should('be.visible');
      cy.get('[data-cy=nest-version]').should('not.contain', 'N/A');
    });
  });

  it('should display correct status indicators', () => {
    // Check if statuses are properly displayed
    cy.get('[data-cy=overall-status]').within(() => {
      cy.get('[data-cy=status-operational]').should('exist');
      cy.get('[data-cy=status-error]').should('not.exist');
    });
    
    cy.get('[data-cy=database-status]').within(() => {
      cy.get('[data-cy=status-operational]').should('exist');
      cy.get('[data-cy=status-error]').should('not.exist');
    });
    
    cy.get('[data-cy=redis-status]').within(() => {
      cy.get('[data-cy=status-operational]').should('exist');
      cy.get('[data-cy=status-error]').should('not.exist');
    });
  });

  it('should handle errors gracefully', () => {
    // This test requires mocking a failed API response
    // We can simulate this with cy.intercept
    cy.intercept('GET', '**/api/system/status', {
      statusCode: 500,
      body: { message: 'Internal Server Error' }
    }).as('getSystemStatus');
    
    // Reload the page to trigger the intercepted request
    cy.reload();
    
    // Wait for the request to complete
    cy.wait('@getSystemStatus');
    
    // Should show error state
    cy.get('[data-cy=system-status-error]').should('be.visible');
    cy.get('[data-cy=error-message]').should('be.visible');
    cy.get('[data-cy=error-message]').should('contain', 'Failed to load system status');
  });

  it('should update data when refreshed', () => {
    // First, capture the timestamp
    let initialTimestamp = '';
    cy.get('[data-cy=last-updated]').invoke('text').then((text) => {
      initialTimestamp = text;
    });
    
    // Intercept the next request to modify the timestamp
    cy.intercept('GET', '**/api/system/status', (req) => {
      req.reply((res) => {
        const body = res.body;
        body.timestamp = new Date().toISOString(); // Update to current time
        res.send(body);
      });
    }).as('getUpdatedStatus');
    
    // Reload the page to get new data
    cy.reload();
    cy.wait('@getUpdatedStatus');
    
    // Check if timestamp has been updated
    cy.get('[data-cy=last-updated]').invoke('text').should('not.equal', initialTimestamp);
  });
}); 