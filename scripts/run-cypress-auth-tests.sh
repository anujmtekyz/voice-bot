#!/bin/bash

# Simplified script to run authentication Cypress tests
set -e

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Cypress authentication tests...${NC}"
echo -e "${YELLOW}Note: This script assumes both backend and frontend are already running.${NC}"
echo -e "${YELLOW}If they're not running, please start them in separate terminals.${NC}"
echo -e "${YELLOW}Press Enter when ready to continue or Ctrl+C to cancel...${NC}"
read -r

# Run the Cypress tests
echo -e "${YELLOW}Running end-to-end authentication tests...${NC}"
pnpm run cypress:run --spec "cypress/e2e/auth.cy.ts"
TEST_RESULT=$?

# Report the result
if [ $TEST_RESULT -eq 0 ]; then
  echo -e "${GREEN}Authentication tests passed successfully!${NC}"
  exit 0
else
  echo -e "${RED}Authentication tests failed!${NC}"
  exit 1
fi 