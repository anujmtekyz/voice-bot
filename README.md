# Voice Bot

A full-stack application for voice-controlled task management with authentication, integrating with Jira-like project management systems.

## Features

- User Authentication with JWT
- Voice Command Processing
- Task Management
- Admin Dashboard

## Prerequisites

- Docker and Docker Compose
- Node.js 18 or later (if running locally)
- pnpm (if running locally)

## Running with Docker

The easiest way to get started is using Docker Compose, which will set up the entire environment including:

- PostgreSQL database
- Redis cache
- Backend API server
- Frontend application

### Step 1: Set up environment variables

```bash
cp .env.example .env
```

Edit the `.env` file and update any required variables, particularly:
- Database credentials (if needed)
- JWT secret (use a strong secret for production)
- OpenRouter API key (if using voice features)

### Step 2: Start the services

```bash
docker-compose up -d
```

This will start all services. The first run will take longer as it builds the images.

### Step 3: Access the application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- API Documentation: http://localhost:3001/api/docs

### Test Accounts

The seed data creates two test accounts:

1. Admin User:
   - Email: admin@example.com
   - Password: AdminPassword123!

2. Regular User:
   - Email: user@example.com
   - Password: Password123!

## Running Locally (Development)

If you prefer to run the application without Docker:

### Backend

```bash
cd server
cp .env.example .env  # Configure your environment
pnpm install
pnpm run migration:run  # Initialize the database
pnpm run seed  # Seed initial data
pnpm run start:dev  # Start the backend in development mode
```

### Frontend

```bash
pnpm install
pnpm run dev  # Start the frontend in development mode
```

## Database Migrations

To create a new migration after changing entities:

```bash
cd server
pnpm run migration:generate -- src/database/migrations/YourMigrationName
```

To run pending migrations:

```bash
pnpm run migration:run
```

## License

[MIT License](LICENSE) 