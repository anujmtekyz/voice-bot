#!/bin/bash

# Set the backend API URL - change as needed
BACKEND_URL="http://localhost:3001"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Starting Integration Tests for Jira Voice Bot ===${NC}"
echo -e "${BLUE}Using backend URL: ${BACKEND_URL}${NC}"
echo ""

# Function to run tests and check results
run_test() {
  local test_file=$1
  local test_name=$2
  
  echo -e "${BLUE}Running $test_name tests...${NC}"
  
  docker run --network=host -v $PWD:/e2e -w /e2e cypress/included:13.6.4 \
    cypress run --spec "cypress/e2e/$test_file" --config "baseUrl=$BACKEND_URL" \
    --reporter json > test_output.json
  
  local success=$(cat test_output.json | grep -c '"state": "passed"')
  local total=$(cat test_output.json | grep -c '"state":')
  
  if [ "$success" -eq "$total" ]; then
    echo -e "${GREEN}✓ All $success tests passed for $test_name${NC}"
  else
    echo -e "${RED}✗ $success/$total tests passed for $test_name${NC}"
  fi
  
  rm test_output.json
  echo ""
}

# Run all the passing integration tests
run_test "custom-api-integration.cy.ts" "API Integration"
run_test "voice-api-test.cy.ts" "Voice API"
run_test "working-api-tests.cy.ts" "Working API"
run_test "voice-integration-test.cy.ts" "Voice Integration"
run_test "voice-service-integration.cy.ts" "Voice Service"

echo -e "${BLUE}=== Integration Tests Complete ===${NC}"
echo -e "${BLUE}See test-results.md for detailed findings${NC}" 