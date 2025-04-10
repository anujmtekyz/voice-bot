/// <reference types="cypress" />

describe('System API Integration', () => {
  beforeEach(() => {
    // Visit the dashboard page where the system status component is located
    cy.visit('/dashboard');
    
    // Wait for the page to load
    cy.contains('Dashboard').should('be.visible');
  });

  it('should correctly fetch and display data from the API', () => {
    // Intercept the API calls to verify they are being made correctly
    cy.intercept('GET', '**/api/system/status').as('getSystemStatus');
    cy.intercept('GET', '**/api/system/version').as('getSystemVersion');
    
    // Wait for both API calls to complete
    cy.wait(['@getSystemStatus', '@getSystemVersion']);
    
    // Verify the response from API calls
    // @ts-ignore
    cy.get('@getSystemStatus').then((interception) => {
      // @ts-ignore
      expect(interception.response.statusCode).to.equal(200);
      // @ts-ignore
      expect(interception.response.body).to.have.property('status');
      // @ts-ignore
      expect(interception.response.body).to.have.property('database');
      // @ts-ignore
      expect(interception.response.body).to.have.property('services');
      // @ts-ignore
      expect(interception.response.body.services).to.have.property('redis');
    });
    
    // @ts-ignore
    cy.get('@getSystemVersion').then((interception) => {
      // @ts-ignore
      expect(interception.response.statusCode).to.equal(200);
      // @ts-ignore
      expect(interception.response.body).to.have.property('version');
      // @ts-ignore
      expect(interception.response.body).to.have.property('environment');
      // @ts-ignore
      expect(interception.response.body).to.have.property('nodeVersion');
      // @ts-ignore
      expect(interception.response.body).to.have.property('nestVersion');
    });
    
    // Check if data from API is correctly displayed in the component
    cy.get('[data-cy=system-status]').should('be.visible');
    
    // Check database message matches what came from the API
    // @ts-ignore
    cy.get('@getSystemStatus').then((interception) => {
      // @ts-ignore
      const dbMessage = interception.response.body.database.message;
      cy.get('[data-cy=database-message]').should('contain', dbMessage);
    });
    
    // Check version matches what came from the API
    // @ts-ignore
    cy.get('@getSystemVersion').then((interception) => {
      // @ts-ignore
      const appVersion = interception.response.body.version;
      cy.get('[data-cy=app-version]').should('contain', appVersion);
      
      // @ts-ignore
      const environment = interception.response.body.environment;
      cy.get('[data-cy=environment]').should('contain', environment);
      
      // @ts-ignore
      const nodeVersion = interception.response.body.nodeVersion;
      cy.get('[data-cy=node-version]').should('contain', nodeVersion);
      
      // @ts-ignore
      const nestVersion = interception.response.body.nestVersion;
      cy.get('[data-cy=nest-version]').should('contain', nestVersion);
    });
  });

  it('should handle API error responses appropriately', () => {
    // Mock a failed status API call but successful version call
    cy.intercept('GET', '**/api/system/status', {
      statusCode: 500,
      body: { message: 'Internal Server Error' }
    }).as('failedStatusCall');
    
    cy.intercept('GET', '**/api/system/version').as('getSystemVersion');
    
    // Reload the page to trigger the intercepted requests
    cy.reload();
    
    // Wait for the API calls to complete
    cy.wait(['@failedStatusCall', '@getSystemVersion']);
    
    // Should show error state
    cy.get('[data-cy=system-status-error]').should('be.visible');
    cy.get('[data-cy=error-message]').should('be.visible');
    cy.get('[data-cy=error-message]').should('contain', 'Failed to load system status');
  });

  it('should retry failed API calls on refresh', () => {
    // First mock a failed request
    cy.intercept('GET', '**/api/system/status', {
      statusCode: 500,
      body: { message: 'Internal Server Error' }
    }).as('failedStatusCall');
    
    // Reload the page to trigger the failed request
    cy.reload();
    cy.wait('@failedStatusCall');
    
    // Verify we see the error state
    cy.get('[data-cy=system-status-error]').should('be.visible');
    
    // Now mock successful responses for next refresh
    cy.intercept('GET', '**/api/system/status', {
      statusCode: 200,
      body: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: {
          status: 'ok',
          message: 'Database connection is active'
        },
        services: {
          redis: {
            status: 'ok',
            message: 'Redis connection is active'
          }
        }
      }
    }).as('successfulStatusCall');
    
    // Reload the page to retry
    cy.reload();
    cy.wait('@successfulStatusCall');
    
    // Should show successful state now
    cy.get('[data-cy=system-status]').should('be.visible');
    cy.get('[data-cy=system-status-error]').should('not.exist');
    cy.get('[data-cy=overall-status]').find('[data-cy=status-operational]').should('be.visible');
  });

  it('should allow tabbing through the dashboard to reach system status component', () => {
    // Test keyboard navigation
    // @ts-ignore Custom command
    cy.get('body').tab();
    
    // Tab until we reach the system status section (would typically take multiple tabs)
    // This tests accessibility of the component
    // @ts-ignore Custom commands
    cy.focused().tab({ shift: false, multiple: true }).until((el) => {
      return Cypress.$(el).closest('[data-cy=system-status]').length > 0;
    });
    
    // Verify we reached the system status component
    cy.focused().should('be.visible');
    cy.focused().should('have.attr', 'data-cy').and('include', 'system-status');
  });
}); 