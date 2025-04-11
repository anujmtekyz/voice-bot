/// <reference types="cypress" />

describe('Working API Tests', () => {
  it('should correctly handle authentication failure for incorrect credentials', () => {
    cy.request({
      method: 'POST',
      url: '/api/auth/login',
      body: {
        email: 'admin@example.com',
        password: 'WrongPassword123!'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property('statusCode', 401);
      expect(response.body).to.have.property('message');
    });
  });

  it('should require authorization for protected endpoints', () => {
    cy.request({
      method: 'GET',
      url: '/api/auth/me',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property('statusCode', 401);
      expect(response.body).to.have.property('message');
    });
  });

  it('should handle non-existent endpoints correctly', () => {
    cy.request({
      method: 'GET',
      url: '/api/non-existent-endpoint',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('statusCode', 404);
      expect(response.body).to.have.property('message');
    });
  });

  it('should include appropriate CORS headers', () => {
    cy.request({
      method: 'GET',
      url: '/api/auth/me',  // Using an endpoint we know exists
      failOnStatusCode: false
    }).then((response) => {
      expect(response.headers).to.have.property('access-control-allow-origin');
      expect(response.headers).to.have.property('access-control-allow-credentials');
    });
  });
}); 