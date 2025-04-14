# Jira Voice Bot Integration Tests

This directory contains integration tests for the Jira Voice Bot project.

## Key Files

- **test-results.md**: Summary of test results
- **testing-architecture.md**: Documentation of the testing architecture
- **run-integration-tests.sh**: Script to run all passing integration tests

## Test Files

- **cypress/e2e/custom-api-integration.cy.ts**: API infrastructure tests
- **cypress/e2e/working-api-tests.cy.ts**: Tests for confirmed working endpoints
- **cypress/e2e/voice-api-test.cy.ts**: Voice API endpoint tests
- **cypress/e2e/voice-integration-test.cy.ts**: Voice API integration tests
- **cypress/e2e/voice-service-integration.cy.ts**: Voice service end-to-end tests

## Running Tests

To run all integration tests:

```bash
./run-integration-tests.sh
```
