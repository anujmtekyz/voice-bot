#!/bin/bash

# Script to run authentication end-to-end tests
set -e

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up test environment...${NC}"

# Check if Docker is installed and running
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed or not in PATH.${NC}"
    echo -e "Please install Docker and try again."
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: docker-compose is not installed or not in PATH.${NC}"
    echo -e "Please install docker-compose and try again."
    echo -e "You can also run tests manually as described in docs/task2-testing-guide.md"
    exit 1
fi

# Check docker status
docker info &> /dev/null || {
    echo -e "${RED}Error: Docker is not running or the current user doesn't have permission to use Docker.${NC}"
    echo -e "Please start Docker service and ensure you have the right permissions."
    exit 1
}

# Run tests manually if Docker setup is not available
echo -e "${YELLOW}Do you want to run tests with Docker (requires Docker and docker-compose) or just start Cypress? [docker/cypress] ${NC}"
read -r run_mode

if [ "$run_mode" = "cypress" ]; then
    echo -e "${YELLOW}Starting Cypress tests...${NC}"
    echo -e "${YELLOW}Make sure backend and frontend are already running before proceeding.${NC}"
    echo -e "${YELLOW}Press Enter when ready to continue...${NC}"
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
    exit 0
fi

# Start the database services with Docker Compose
echo -e "${YELLOW}Starting database containers...${NC}"
cd server
docker-compose up -d postgres redis
cd ..

# Wait for databases to be ready
echo -e "${YELLOW}Waiting for databases to be ready...${NC}"
sleep 5

# Build and start the backend server
echo -e "${YELLOW}Starting backend server...${NC}"
cd server
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}Installing backend dependencies...${NC}"
  pnpm install
fi

# Check if the script exists
if [ -f "package.json" ]; then
  # Get the available scripts
  available_scripts=$(grep -o '"[a-zA-Z0-9:_-]*":' package.json | tr -d '":')
  
  # Check if the migration script exists
  if [[ $available_scripts == *"typeorm:run-migrations"* ]]; then
    # Run migrations and seed the database
    echo -e "${YELLOW}Running database migrations...${NC}"
    pnpm run typeorm:run-migrations
  else
    echo -e "${YELLOW}Skipping migrations - script not found in package.json${NC}"
  fi
else
  echo -e "${RED}Error: package.json not found in server directory${NC}"
  exit 1
fi

# Start the backend in development mode
echo -e "${YELLOW}Starting backend server...${NC}"
pnpm run start:dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo -e "${YELLOW}Waiting for backend to initialize...${NC}"
sleep 10

# Build and start the frontend
echo -e "${YELLOW}Starting frontend...${NC}"
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}Installing frontend dependencies...${NC}"
  pnpm install
fi

# Start the frontend in development mode
echo -e "${YELLOW}Starting frontend server...${NC}"
pnpm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
echo -e "${YELLOW}Waiting for frontend to initialize...${NC}"
sleep 10

# Run the Cypress tests
echo -e "${YELLOW}Running end-to-end authentication tests...${NC}"
pnpm run cypress:run --spec "cypress/e2e/auth.cy.ts"
TEST_RESULT=$?

# Cleanup: Kill the processes and stop containers
echo -e "${YELLOW}Cleaning up...${NC}"
kill $FRONTEND_PID || true
kill $BACKEND_PID || true

cd server
docker-compose down
cd ..

# Report the result
if [ $TEST_RESULT -eq 0 ]; then
  echo -e "${GREEN}Authentication tests passed successfully!${NC}"
  exit 0
else
  echo -e "${RED}Authentication tests failed!${NC}"
  exit 1
fi 