#!/bin/bash

# Make the script exit on error
set -e

# Display execution steps
set -x

# Start the backend in development mode in the background
cd server
pnpm start:dev &
BACKEND_PID=$!

# Wait for the backend to start up
echo "Waiting for backend to start..."
sleep 5

# Go back to the root directory and start the frontend in development mode
cd ..
pnpm dev &
FRONTEND_PID=$!

# Wait for the frontend to start up
echo "Waiting for frontend to start..."
sleep 5

# Run the backend e2e tests
cd server
pnpm test:e2e

# Go back to the root directory and run the frontend tests
cd ..
pnpm test

# Cleanup: kill the backend and frontend processes
kill $BACKEND_PID
kill $FRONTEND_PID

echo "End-to-end testing complete!" 