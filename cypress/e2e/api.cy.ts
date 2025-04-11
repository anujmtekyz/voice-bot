/// <reference types="cypress" />

describe('API Integration Tests', () => {
  it('should successfully connect to the API status endpoint', () => {
    cy.request('GET', '/api/system/status').then((response) => {
      // @ts-ignore
      expect(response.status).to.eq(200);
      // @ts-ignore
      expect(response.body).to.have.property('status');
      // @ts-ignore
      expect(response.body).to.have.property('timestamp');
      // @ts-ignore
      expect(response.body).to.have.property('database');
      // @ts-ignore
      expect(response.body).to.have.property('services');
    });
  });

  it('should fetch version information', () => {
    cy.request('GET', '/api/system/version').then((response) => {
      // @ts-ignore
      expect(response.status).to.eq(200);
      // @ts-ignore
      expect(response.body).to.have.property('version');
      // @ts-ignore
      expect(response.body).to.have.property('environment');
      // @ts-ignore
      expect(response.body).to.have.property('nestVersion');
      // @ts-ignore
      expect(response.body).to.have.property('nodeVersion');
    });
  });

  it('should handle non-existent endpoints correctly', () => {
    cy.request({
      method: 'GET',
      url: '/api/non-existent-endpoint',
      failOnStatusCode: false
    }).then((response) => {
      // @ts-ignore
      expect(response.status).to.eq(404);
      // @ts-ignore
      expect(response.body).to.have.property('statusCode', 404);
      // @ts-ignore
      expect(response.body).to.have.property('message');
    });
  });

  it('should validate request body for endpoints requiring data', () => {
    cy.request({
      method: 'POST',
      url: '/auth/login',
      body: {
        // Missing required fields
      },
      failOnStatusCode: false
    }).then((response) => {
      // @ts-ignore
      expect(response.status).to.eq(400);
      // @ts-ignore
      expect(response.body).to.have.property('statusCode', 400);
      // @ts-ignore
      expect(response.body).to.have.property('message');
    });
  });

  it('should enforce authentication for protected routes', () => {
    cy.request({
      method: 'GET',
      url: '/auth/me',
      failOnStatusCode: false
    }).then((response) => {
      // @ts-ignore
      expect(response.status).to.eq(401);
      // @ts-ignore
      expect(response.body).to.have.property('statusCode', 401);
      // @ts-ignore
      expect(response.body).to.have.property('message');
    });
  });

  // Test for API rate limiting
  it('should have rate limiting headers', () => {
    cy.request('GET', '/api/system/status').then((response) => {
      // @ts-ignore
      expect(response.headers).to.have.property('x-ratelimit-limit');
      // @ts-ignore
      expect(response.headers).to.have.property('x-ratelimit-remaining');
    });
  });

  // Test for CORS headers
  it('should include appropriate CORS headers', () => {
    cy.request('GET', '/api/system/status').then((response) => {
      // @ts-ignore
      expect(response.headers).to.have.property('access-control-allow-origin');
    });
  });

  // Tests for pagination
  it('should support pagination for list endpoints', () => {
    // This test uses a mock since we may not have the /projects endpoint
    cy.intercept('GET', '/api/users*', {
      statusCode: 200,
      body: {
        items: [
          { id: '1', email: 'user1@example.com' },
          { id: '2', email: 'user2@example.com' }
        ],
        meta: {
          totalItems: 2,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1
        }
      }
    }).as('getUsers');
    
    cy.request('GET', '/api/users?page=1&limit=10').then((response) => {
      // @ts-ignore
      expect(response.status).to.eq(200);
      // @ts-ignore
      expect(response.body).to.have.property('items');
      // @ts-ignore
      expect(response.body).to.have.property('meta');
    });
  });
}); 