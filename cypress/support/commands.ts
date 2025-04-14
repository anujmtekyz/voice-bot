/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/auth/login`,
    body: { email, password },
  }).then((response) => {
    window.localStorage.setItem('token', response.body.accessToken);
    return response.body;
  });
});

// Command to check system status component elements
Cypress.Commands.add('checkSystemStatusComponent', () => {
  // Check header elements
  cy.get('[data-cy=system-status]').within(() => {
    cy.contains('System Status').should('be.visible');
    cy.contains('Current system health and version information').should('be.visible');
    
    // Check system health section
    cy.contains('System Health').should('be.visible');
    cy.contains('Overall Status').should('be.visible');
    cy.contains('Database').should('be.visible');
    cy.contains('Redis').should('be.visible');
    
    // Check version information section
    cy.contains('Version Information').should('be.visible');
    cy.contains('App Version').should('be.visible');
    cy.contains('Environment').should('be.visible');
    cy.contains('Node.js').should('be.visible');
    cy.contains('NestJS').should('be.visible');
  });
});

// Tab command for keyboard navigation testing
Cypress.Commands.add('tab', { prevSubject: 'optional' }, (subject, options) => {
  const defaultOptions = {
    shift: false,
    multiple: false,
  };

  const opts = { ...defaultOptions, ...options };
  const keyEvent = opts.shift ? 'shiftKey' : undefined;
  const el = subject || cy.focused();

  if (opts.multiple) {
    return el.then($el => {
      if ($el.length) {
        Cypress.log({
          name: 'tab',
          message: opts.shift ? 'with shift' : 'without shift',
          $el,
        });
        const keyCode = 9; // Tab key
        const tabEvent = new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          key: 'Tab',
          code: 'Tab',
          keyCode,
          which: keyCode,
          [keyEvent]: opts.shift ? true : false,
        });
        $el[0].dispatchEvent(tabEvent);
      }
      return $el;
    });
  }

  return el.tab(opts);
});

// Custom until command for tabbing until condition is met
Cypress.Commands.add('until', { prevSubject: 'element' }, (subject, predicate, options = {}) => {
  const maxAttempts = options.maxAttempts || 10;
  const delay = options.delay || 100;
  
  const check = (attempt = 0) => {
    if (attempt >= maxAttempts) {
      throw new Error(`Maximum number of tab attempts (${maxAttempts}) exceeded`);
    }

    return cy.wrap(subject).then($el => {
      const result = predicate($el);
      if (result) {
        return cy.wrap($el);
      }

      return cy.wrap($el)
        .tab()
        .wait(delay)
        .then($nextEl => {
          return check(attempt + 1);
        });
    });
  };

  return check();
});

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })

// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<any>
      checkSystemStatusComponent(): Chainable<void>
      tab(options?: { shift?: boolean, multiple?: boolean }): Chainable<JQuery<HTMLElement>>
      until(predicate: (el: JQuery<HTMLElement>) => boolean, options?: { maxAttempts?: number, delay?: number }): Chainable<JQuery<HTMLElement>>
      // drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      // dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      // visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
      /**
       * Custom command to login a user
       * @example cy.loginUser('email@example.com', 'password123')
       */
      loginUser(email: string, password: string): Chainable<void>
      apiRequest(method: string, path: string, body?: any): Chainable<any>
      testVoiceCommand(command: string, expectedResponse: string): Chainable<any>
      clearTestData(): Chainable<any>
    }
  }
}

// Login command for authentication tests
Cypress.Commands.add('loginUser', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-testid=email]').type(email);
  cy.get('[data-testid=password]').type(password);
  cy.get('[data-testid=login-button]').click();
  cy.wait('@loginRequest');
});

// API request with auth token
Cypress.Commands.add('apiRequest', (method: string, path: string, body?: any) => {
  const token = window.localStorage.getItem('token');
  return cy.request({
    method,
    url: `${Cypress.env('apiUrl')}${path}`,
    body,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
});

// Voice command test helper
Cypress.Commands.add('testVoiceCommand', (command: string, expectedResponse: string) => {
  cy.apiRequest('POST', '/voice/command', {
    type: 'text',
    content: command,
  }).then((response) => {
    expect(response.body).to.have.property('success', true);
    if (expectedResponse) {
      expect(response.body.response.message).to.include(expectedResponse);
    }
  });
});

// Clear test data
Cypress.Commands.add('clearTestData', () => {
  const token = window.localStorage.getItem('token');
  if (token) {
    cy.apiRequest('POST', '/test/cleanup');
  }
});

export {}; 