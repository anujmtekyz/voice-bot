describe('System Status Component', () => {
  const mockHealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: {
      status: 'ok',
      message: 'Connected successfully'
    },
    services: {
      redis: {
        status: 'ok',
        message: 'Connected successfully'
      }
    }
  };

  const mockVersionResponse = {
    version: '1.0.0',
    environment: 'test',
    nodeVersion: 'v18.0.0',
    nestVersion: '10.0.0'
  };

  beforeEach(() => {
    // Reset API mocks before each test
    cy.intercept('GET', '/api/system/status', (req) => {
      req.reply({
        delay: 500, // Add delay to test loading state
        statusCode: 200,
        body: mockHealthResponse
      });
    }).as('getHealth');

    cy.intercept('GET', '/api/system/version', (req) => {
      req.reply({
        delay: 500, // Add delay to test loading state
        statusCode: 200,
        body: mockVersionResponse
      });
    }).as('getVersion');
  });

  it('should show loading state while fetching data', () => {
    cy.visit('/dashboard');
    cy.get('[data-cy=system-status-loading]').should('be.visible');
    cy.wait(['@getHealth', '@getVersion']);
    cy.get('[data-cy=system-status-loading]').should('not.exist');
  });

  it('should display system status with data', () => {
    cy.visit('/dashboard');
    cy.wait(['@getHealth', '@getVersion']);

    // Check health section
    cy.get('[data-cy=system-status]').should('be.visible');
    cy.get('[data-cy=overall-status]').find('[data-cy=status-operational]').should('be.visible');
    cy.get('[data-cy=database-status]').find('[data-cy=status-operational]').should('be.visible');
    cy.get('[data-cy=redis-status]').find('[data-cy=status-operational]').should('be.visible');

    // Check version section
    cy.get('[data-cy=app-version]').should('contain', mockVersionResponse.version);
    cy.get('[data-cy=environment]').should('contain', mockVersionResponse.environment);
    cy.get('[data-cy=node-version]').should('contain', mockVersionResponse.nodeVersion);
    cy.get('[data-cy=nest-version]').should('contain', mockVersionResponse.nestVersion);
  });

  it('should handle server errors', () => {
    // Mock server error response
    cy.intercept('GET', '/api/system/status', {
      statusCode: 500,
      body: { message: 'Internal server error' }
    }).as('getHealthError');

    cy.visit('/dashboard');
    cy.wait('@getHealthError');
    cy.get('[data-cy=system-status-error]').should('be.visible');
    cy.get('[data-cy=error-message]').should('contain', 'Failed to load system status');
  });

  it('should handle API not implemented', () => {
    // Mock not implemented response
    cy.intercept('GET', '/api/system/status', {
      statusCode: 404,
      body: { message: 'Not Found' }
    }).as('getHealthNotFound');

    cy.visit('/dashboard');
    cy.wait('@getHealthNotFound');
    cy.get('[data-cy=system-status-error]').should('be.visible');
    cy.get('[data-cy=error-message]').should('contain', 'Failed to load system status');
  });

  it('should refresh data when refresh button is clicked', () => {
    cy.visit('/dashboard');
    cy.wait(['@getHealth', '@getVersion']);

    // Update mock response with new timestamp
    const newTimestamp = new Date().toISOString();
    cy.intercept('GET', '/api/system/status', {
      statusCode: 200,
      body: { ...mockHealthResponse, timestamp: newTimestamp }
    }).as('getHealthRefresh');

    // Click refresh button and verify new data
    cy.get('[data-cy=refresh-button]').click();
    cy.wait('@getHealthRefresh');
    cy.get('[data-cy=last-updated]').should('contain', new Date(newTimestamp).toLocaleString());
  });
}); 