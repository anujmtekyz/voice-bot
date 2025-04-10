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
      // @ts-ignore
      expect(response.body).to.have.property('error', 'Not Found');
    });
  });

  it('should validate request body for endpoints requiring data', () => {
    cy.request({
      method: 'POST',
      url: '/api/auth/login',
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
      // @ts-ignore
      expect(response.body).to.have.property('error', 'Bad Request');
    });
  });

  it('should enforce authentication for protected routes', () => {
    cy.request({
      method: 'GET',
      url: '/api/users/me',
      failOnStatusCode: false
    }).then((response) => {
      // @ts-ignore
      expect(response.status).to.eq(401);
      // @ts-ignore
      expect(response.body).to.have.property('statusCode', 401);
      // @ts-ignore
      expect(response.body).to.have.property('message');
      // @ts-ignore
      expect(response.body).to.have.property('error', 'Unauthorized');
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
    // This assumes you have at least some data in your system
    cy.request('GET', '/api/projects?page=1&limit=10').then((response) => {
      // @ts-ignore
      expect(response.status).to.eq(200);
      // @ts-ignore
      expect(response.body).to.have.property('items');
      // @ts-ignore
      expect(response.body).to.have.property('meta');
      // @ts-ignore
      expect(response.body.meta).to.have.property('totalItems');
      // @ts-ignore
      expect(response.body.meta).to.have.property('itemsPerPage');
      // @ts-ignore
      expect(response.body.meta).to.have.property('totalPages');
      // @ts-ignore
      expect(response.body.meta).to.have.property('currentPage');
    });
  });
}); 