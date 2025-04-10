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
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('[data-cy=email-input]').type(email);
  cy.get('[data-cy=password-input]').type(password);
  cy.get('[data-cy=login-button]').click();
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
      login(email: string, password: string): Chainable<void>
      checkSystemStatusComponent(): Chainable<void>
      tab(options?: { shift?: boolean, multiple?: boolean }): Chainable<JQuery<HTMLElement>>
      until(predicate: (el: JQuery<HTMLElement>) => boolean, options?: { maxAttempts?: number, delay?: number }): Chainable<JQuery<HTMLElement>>
      // drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      // dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      // visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
    }
  }
} 