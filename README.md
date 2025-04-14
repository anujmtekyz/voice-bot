# Voice Bot Project

A voice-enabled bot for interacting with JIRA using natural language commands.

## Documentation Structure

The project documentation is organized in the following categories:

### Architecture (`docs/architecture/`)
- `services-architecture.md` - Overall service architecture and design
- `testing-architecture.md` - Testing architecture and strategy

### API (`docs/api/`)
- `api-requirements.md` - API specifications and requirements
- `openrouter-feasibility.md` - OpenRouter integration feasibility study
- `system-api-integration.md` - System API integration guide

### Testing (`docs/testing/`)
- Test plans and results
- Integration testing guides
- Authentication testing documentation
- Cypress integration guides

### Deployment (`docs/deployment/`)
- `production-details.md` - Production deployment guide and considerations

## Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start the development environment:
   ```bash
   docker compose up -d
   ```

The application will be available at:
- Frontend: http://localhost:3005
- Backend API: http://localhost:3001

## Development

### Prerequisites
- Node.js 20+
- Docker and Docker Compose
- PostgreSQL 15 (if running locally)
- Redis 7 (if running locally)

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run start` - Start the production server
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run cypress` - Open Cypress test runner
- `npm run cypress:run` - Run Cypress tests headlessly

## Contributing

Please read through our contributing guidelines in the documentation.

## License

This project is proprietary and confidential. 