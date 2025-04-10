/// <reference types="cypress" />

describe('System Status with Fixtures', () => {
  beforeEach(() => {
    // Load fixtures for system status and version
    cy.fixture('system-status.json').as('statusData');
    cy.fixture('system-version.json').as('versionData');
    
    // Setup intercepts with the fixture data
    cy.intercept('GET', '**/api/system/status', { fixture: 'system-status.json' }).as('statusRequest');
    cy.intercept('GET', '**/api/system/version', { fixture: 'system-version.json' }).as('versionRequest');
    
    // Visit the dashboard page where system status component is displayed
    cy.visit('/dashboard');
    
    // Wait for the component to load and API calls to complete
    cy.wait(['@statusRequest', '@versionRequest']);
    cy.get('[data-cy=system-status]').should('be.visible');
  });
  
  it('should display the fixture data correctly', () => {
    // Get fixture data
    // @ts-ignore
    cy.get('@statusData').then((statusData) => {
      // Check the database message is displayed correctly from fixture
      // @ts-ignore
      cy.get('[data-cy=database-message]').should('contain', statusData.database.message);
      
      // Check the status badges
      // @ts-ignore
      cy.get('[data-cy=overall-status]').find(statusData.status === 'ok' 
        ? '[data-cy=status-operational]' 
        : '[data-cy=status-error]').should('be.visible');
      
      // Check services status
      // @ts-ignore
      Object.keys(statusData.services).forEach(service => {
        // @ts-ignore
        cy.get(`[data-cy=${service}-status]`).should('be.visible');
      });
    });
    
    // @ts-ignore
    cy.get('@versionData').then((versionData) => {
      // Check version info
      // @ts-ignore
      cy.get('[data-cy=app-version]').should('contain', versionData.version);
      // @ts-ignore
      cy.get('[data-cy=environment]').should('contain', versionData.environment);
      // @ts-ignore
      cy.get('[data-cy=node-version]').should('contain', versionData.nodeVersion);
      // @ts-ignore
      cy.get('[data-cy=nest-version]').should('contain', versionData.nestVersion);
    });
  });
  
  it('should be able to change fixture data during test', () => {
    // Intercept the status request again but with modified fixture data
    cy.intercept('GET', '**/api/system/status', {
      statusCode: 200,
      body: {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: {
          status: 'error',
          message: 'Database connection failed'
        },
        services: {
          redis: {
            status: 'error',
            message: 'Redis connection failed'
          }
        }
      }
    }).as('modifiedStatusRequest');
    
    // Trigger a refresh of the component
    cy.get('[data-cy=refresh-button]').click();
    
    // Wait for the modified request
    cy.wait('@modifiedStatusRequest');
    
    // Check that the UI now shows error state
    cy.get('[data-cy=database-message]').should('contain', 'Database connection failed');
    cy.get('[data-cy=overall-status]').find('[data-cy=status-error]').should('be.visible');
    cy.get('[data-cy=redis-status]').find('[data-cy=status-error]').should('be.visible');
  });
}); 