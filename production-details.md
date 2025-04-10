# JIRA Voice Bot - Production Details Document

## 1. Overview

The JIRA Integration with AI Chat Voicebot is an intelligent voice-activated interface that connects with JIRA to enable hands-free ticket creation, updates, and tracking using natural language voice commands. The application provides a modern web interface with voice recognition capabilities, allowing users to manage their JIRA workflow through spoken commands.

## 2. User Interface Components

Based on the application screenshots, the following key interfaces are available:

### 2.1 Authentication Screens

#### Login Page
- Clean, minimalist login form with email/password fields
- Authentication with JIRA credentials
- "Forgot Password" option available
- Secure login workflow

#### Forgot Password & Reset Password
- User-friendly password recovery process
- Email-based reset functionality
- Secure token-based password reset

### 2.2 Dashboard

The dashboard serves as the central hub for users after authentication:
- Summary metrics and KPIs
- Recent activity section
- Quick access to projects and tickets
- Voice command activation button
- Sidebar navigation to other sections
- Header with user profile and notifications

### 2.3 Tickets Management

The tickets interface provides:
- List view of tickets with filtering options
- Ticket details including status, priority, assignee
- Creation and editing capabilities through both UI and voice
- Search functionality
- Sorting and filtering options

### 2.4 Projects Management

The projects section includes:
- Project listings with status indicators
- Team member assignment information
- Project details and progress metrics
- Filtering and search capabilities

### 2.5 Voice Features

#### Voice Commands
- List of available voice commands and examples
- Command categories (tickets, projects, reporting)
- Training interface for custom commands
- Usage instructions and tips

#### Voice History
- Chronological record of voice interactions
- Success/failure indicators for commands
- Transcript of voice inputs and system responses
- Filtering options by date, command type

#### Voice Settings
- Voice recognition sensitivity controls
- Language and dialect settings
- Microphone configuration
- Privacy settings for voice data
- Wake word customization

### 2.6 Reports

- Visual data representations (charts, graphs)
- Customizable reporting period
- Export functionality
- Filter controls
- Voice-activated reporting capabilities

### 2.7 User Profile

- Personal information management
- Notification preferences
- Theme settings (light/dark mode)
- Account security options
- Integration settings with JIRA

## 3. Voice Command Capabilities

### 3.1 Ticket Management Commands

| Command Category | Example Commands | Description |
|------------------|------------------|-------------|
| Creation | "Create bug ticket for login issue" | Creates new tickets with specified type |
| | "New task for API integration" | |
| | "Create story about user authentication" | |
| Updates | "Change ticket ABC-123 status to in progress" | Updates ticket properties |
| | "Assign ticket XYZ-456 to David" | |
| | "Set priority of ticket DEF-789 to high" | |
| Querying | "Show my open tickets" | Retrieves ticket information |
| | "Find bugs in authentication module" | |
| | "List tickets assigned to Sarah" | |
| Comments | "Add comment to ticket HIJ-012: Fixed in latest commit" | Adds updates to tickets |
| | "Comment on PRJ-345: Needs design review" | |

### 3.2 Project Management Commands

| Command Category | Example Commands | Description |
|------------------|------------------|-------------|
| Navigation | "Open CRM project" | Navigates to specific projects |
| | "Show mobile app project details" | |
| Status Updates | "What's the status of website redesign project?" | Gets project information |
| | "Show progress on Q3 objectives" | |
| Team | "Add James to marketing project" | Manages team assignments |
| | "List team members on API project" | |

### 3.3 Reporting Commands

| Command Category | Example Commands | Description |
|------------------|------------------|-------------|
| Generation | "Create sprint report for team alpha" | Generates specific reports |
| | "Show burndown chart for current sprint" | |
| Time Periods | "Generate tickets resolved last week" | Reports for specific timeframes |
| | "Show project progress this quarter" | |
| Comparisons | "Compare bug resolution time between teams" | Creates comparative reports |
| | "Show velocity trends across sprints" | |

### 3.4 System Commands

| Command Category | Example Commands | Description |
|------------------|------------------|-------------|
| Navigation | "Go to dashboard" | Navigates application sections |
| | "Open settings" | |
| | "Return to tickets page" | |
| Help | "Show available commands" | Provides assistance |
| | "How do I create a ticket?" | |
| Profile | "Update my profile" | Manages user settings |
| | "Log out" | |

### 3.5 Advanced Voice Workflows

The system supports multi-step voice workflows to handle complex JIRA operations:

| Workflow Type | Example Interaction | Description |
|---------------|---------------------|-------------|
| Guided Ticket Creation | **User**: "Create new bug ticket"<br>**System**: "What's the title of the bug?"<br>**User**: "Login page crashes on mobile"<br>**System**: "What's the priority?"<br>**User**: "High"<br>**System**: "Created bug ticket PROJ-123: Login page crashes on mobile with high priority" | Step-by-step ticket creation with system prompts |
| Contextual Follow-ups | **User**: "Show me all critical bugs"<br>**System**: *Displays list*<br>**User**: "Assign the first one to David"<br>**System**: "Assigned PROJ-456 to David" | System maintains context between commands |
| Conditional Workflows | **User**: "If any high-priority tickets are unassigned, assign them to the project lead"<br>**System**: "Found 3 unassigned high-priority tickets. Assigned to Sarah (Project Lead)" | Complex conditional logic through voice |
| Batch Operations | **User**: "Close all tickets related to the login page redesign"<br>**System**: "Found 5 tickets related to login page redesign. Should I close all of them?"<br>**User**: "Yes"<br>**System**: "Closed 5 tickets" | Bulk operations with confirmation |
| Natural Language Reporting | **User**: "How many bugs did we fix last sprint compared to the previous one?"<br>**System**: "Last sprint: 24 bugs fixed. Previous sprint: 18 bugs fixed. That's a 33% increase." | Complex data analysis via conversational queries |

### 3.6 Voice Command Privacy and Security

- All voice commands are processed with strict privacy controls
- Voice data retention policies align with organizational requirements
- Users can opt to delete their voice command history at any time
- Sensitive information is filtered from voice transcriptions
- Voice commands containing credentials or sensitive data are not stored
- Local processing option for commands that don't require cloud services

## 4. Technical Implementation

### 4.1 Frontend Architecture

- **Framework**: Next.js with App Router
- **UI Components**: Custom components with Shadcn UI
- **Styling**: Tailwind CSS with responsive design
- **State Management**: React hooks and Context API
- **Authentication**: JWT-based auth flow

#### 4.1.1 Completed UI Implementation

The frontend UI has been fully implemented with the following features:

- **Authentication Screens**:
  - Login page with email/password authentication
  - Forgot password flow
  - Reset password functionality
  - Secure, token-based authentication

- **Dashboard**:
  - Summary metrics with data visualization
  - Recent activity feed
  - Quick access to key functions
  - Responsive design for all device sizes
  - Dark/light mode support

- **Navigation**:
  - Sidebar navigation with collapsible sections
  - Breadcrumb navigation for deep linking
  - Quick search functionality
  - Recent items access

- **Voice Interface Components**:
  - Voice activation button with visual feedback
  - Voice command transcript display
  - Listening state indicators
  - Command suggestions based on context
  - Voice settings customization

- **Data Management Views**:
  - Tickets list with filtering and sorting
  - Project dashboard with metrics
  - User profile and settings
  - Reporting interfaces

- **Accessibility Features**:
  - ARIA attributes for screen readers
  - Keyboard navigation support
  - High contrast mode
  - Focus indicators
  - Text size adjustment

### 4.2 Voice Recognition System

- **Speech Recognition**: Web Speech API for initial voice capture
- **Voice Model**: OpenRouter for advanced voice recognition and natural language understanding
- **Voice Transcription**: OpenRouter-based transcription services for accurate speech-to-text
- **Natural Language Processing**: Intent recognition for command parsing
- **Voice Response**: Text-to-speech for system responses
- **Command Processing Pipeline**:
  1. Voice input capture
  2. Speech-to-text conversion via OpenRouter
  3. Intent recognition and parsing
  4. Command execution
  5. Response generation
  6. Voice/visual feedback

#### 4.2.1 OpenRouter Integration Details

The OpenRouter integration forms the core of our voice recognition capabilities:

- **Model Selection**: Leveraging OpenRouter to access state-of-the-art voice models including:
  - Anthropic Claude 3 Opus for complex command interpretation
  - Whisper-large-v3 for high-accuracy transcription
  - ElevenLabs for natural-sounding voice responses
- **Contextual Understanding**: Maintaining conversation context for multi-step commands
- **Custom Training**: Fine-tuning models specifically for JIRA-related terminology
- **Fallback Mechanisms**: Local processing for basic commands when cloud connectivity is limited
- **Cost Optimization**: Intelligent routing between models based on command complexity
- **Latency Management**: Streaming responses for immediate feedback during processing

### 4.3 Backend Architecture

- **API Framework**: NestJS for scalable and maintainable server implementation
- **API Pattern**: RESTful API design with proper endpoint structuring
- **Authentication**: JWT-based authentication with refresh token strategy
- **Database**: PostgreSQL for robust, relational data storage
- **ORM**: TypeORM for database interaction and migrations
- **Caching**: Redis for performance optimization
- **Logging**: Winston for comprehensive server logs
- **Testing**: Jest for unit and integration testing
- **Documentation**: Swagger for API documentation

### 4.4 Integration with JIRA

- RESTful API integration with JIRA Cloud
- Authentication via OAuth 2.0
- Real-time updates through webhooks
- Data synchronization mechanisms
- NestJS services for JIRA API interaction

### 4.5 Data Model

#### User Schema
```
User {
  id: UUID (PK)
  email: String
  passwordHash: String
  name: String
  role: Enum (Admin, User)
  jiraToken: String (encrypted)
  jiraRefreshToken: String (encrypted)
  voiceSettings: JSON
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### VoiceCommand Schema
```
VoiceCommand {
  id: UUID (PK)
  userId: UUID (FK)
  rawText: String
  interpretedIntent: String
  success: Boolean
  responseData: JSON
  executionTime: Number
  createdAt: DateTime
}
```

#### Project Schema
```
Project {
  id: UUID (PK)
  jiraProjectId: String
  name: String
  key: String
  description: String
  lastSyncedAt: DateTime
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Ticket Schema
```
Ticket {
  id: UUID (PK)
  jiraTicketId: String
  projectId: UUID (FK)
  summary: String
  description: Text
  status: String
  priority: String
  assigneeId: UUID (FK, nullable)
  reporterId: UUID (FK)
  createdAt: DateTime
  updatedAt: DateTime
  lastSyncedAt: DateTime
}
```

### 4.6 OpenRouter Implementation Details

OpenRouter serves as the central AI provider for our voice processing capabilities. The implementation leverages various AI models through a single, unified API:

#### Model Selection and Usage

| Model | Provider | Purpose | Implementation |
|-------|----------|---------|----------------|
| Whisper Large v3 | OpenAI | Speech transcription | Used for high-accuracy conversion of voice input to text |
| Claude 3 Opus | Anthropic | Command processing | Processes transcribed text to extract intent and entities |
| Claude 3 Sonnet | Anthropic | Contextual responses | Generates natural language responses to user queries |
| ElevenLabs | ElevenLabs | Text-to-speech | Converts system responses to natural-sounding voice |

#### Request Flow

1. **Voice Capture**: Frontend captures audio via browser's Web Speech API
2. **Audio Processing**: Raw audio is processed and transmitted to backend
3. **Transcription**: OpenRouter routes audio to Whisper for transcription
4. **Command Interpretation**:
   ```javascript
   // Example OpenRouter API call
   const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
     },
     body: JSON.stringify({
       model: 'anthropic/claude-3-opus',
       messages: [
         { role: 'system', content: 'You are a JIRA assistant that interprets voice commands.' },
         { role: 'user', content: transcribedText }
       ],
       response_format: { type: 'json_object' }
     })
   });
   ```
5. **Action Execution**: NestJS services process the interpreted command against JIRA APIs
6. **Response Generation**: Claude 3 Sonnet generates natural language responses
7. **Voice Synthesis**: ElevenLabs converts response to speech if requested

#### Optimization Strategies

- **Streaming Responses**: Using streaming API for real-time feedback during processing
- **Caching**: Frequently used responses are cached to reduce API calls
- **Batching**: Multiple related commands processed in a single batch where applicable
- **Fallback Chain**: Cascading through models if primary model fails
- **Cost Management**: Using appropriate models based on complexity:
  - Simple commands use smaller, faster models
  - Complex queries leverage more capable models

#### Custom Training

- Domain-specific fine-tuning for JIRA terminology
- Continuous improvement through feedback loops
- Sample command datasets for model optimization

### 4.7 NestJS Architecture Details

The NestJS backend follows a modular, domain-driven design approach:

#### Module Structure

```
src/
├── app.module.ts             # Root application module
├── auth/                     # Authentication domain
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/           # Passport strategies
│   └── guards/               # Auth guards
├── voice/                    # Voice processing domain
│   ├── voice.module.ts
│   ├── voice.controller.ts
│   ├── voice.service.ts
│   ├── dto/                  # Data transfer objects
│   ├── entities/             # Voice entities
│   └── providers/            # OpenRouter integration
├── jira/                     # JIRA integration domain
│   ├── jira.module.ts
│   ├── jira.service.ts
│   ├── jira.controller.ts
│   ├── entities/             # JIRA entities
│   ├── dto/                  # Data transfer objects
│   └── adapters/             # JIRA API adapters
├── tickets/                  # Ticket management domain
├── projects/                 # Project management domain
├── users/                    # User management domain
├── common/                   # Shared utilities and constants
│   ├── decorators/
│   ├── filters/
│   ├── interceptors/
│   └── pipes/
└── config/                   # Configuration modules
```

#### Architecture Patterns

- **Repository Pattern**: TypeORM repositories for database operations
- **Service Layer**: Business logic encapsulated in service classes
- **DTO Pattern**: Data Transfer Objects for API request/response validation
- **Dependency Injection**: NestJS's built-in DI container for service composition
- **Adapter Pattern**: Clean interfaces for external services like JIRA and OpenRouter

#### Key NestJS Features Utilized

- **Middleware**: Request logging, CORS, compression
- **Guards**: Authentication and authorization
- **Interceptors**: Response transformation and caching
- **Pipes**: Request validation and transformation
- **Exception Filters**: Standardized error handling
- **Custom Decorators**: Simplified controller implementation

#### API Documentation

- **Swagger Integration**: Auto-generated API documentation
- **API Versioning**: Support for multiple API versions
- **Rate Limiting**: Protection against API abuse

### 4.8 PostgreSQL Database Implementation

The application uses PostgreSQL as the primary data store, with TypeORM for object-relational mapping.

#### Database Schema Implementation

The PostgreSQL schema is managed through TypeORM migrations:

```typescript
// Example migration file: CreateVoiceCommandTable.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVoiceCommandTable1680123456789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE voice_command (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        raw_text TEXT NOT NULL,
        interpreted_intent TEXT NOT NULL,
        success BOOLEAN NOT NULL DEFAULT false,
        response_data JSONB,
        execution_time INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
        CONSTRAINT fk_user_voice_command FOREIGN KEY (user_id) REFERENCES "user"(id)
      );
      
      CREATE INDEX idx_voice_command_user_id ON voice_command(user_id);
      CREATE INDEX idx_voice_command_created_at ON voice_command(created_at);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX idx_voice_command_created_at;
      DROP INDEX idx_voice_command_user_id;
      DROP TABLE voice_command;
    `);
  }
}
```

#### Database Indexes and Performance

Strategic indexes to optimize query performance:

- Primary keys on all table IDs (UUID type)
- Foreign key indexes for all relationship fields
- Composite indexes for frequently filtered fields
- Full-text search indexes for text search capabilities
- Timestamp indexes for chronological querying

#### Data Migration Strategy

- Incremental schema changes through TypeORM migrations
- Version-controlled migration files in the codebase
- CI/CD pipeline includes migration execution
- Rollback strategies for failed migrations
- Data seeding for development and testing environments

### 4.9 Environment Configuration

The application requires several environment variables for configuration:

```bash
# Application Configuration
NODE_ENV=development                      # Environment: development, test, production
PORT=3000                                 # API server port
FRONTEND_URL=http://localhost:3000        # URL for the frontend application

# Database Configuration
DB_HOST=localhost                         # PostgreSQL host
DB_PORT=5432                              # PostgreSQL port
DB_USERNAME=postgres                      # PostgreSQL username
DB_PASSWORD=postgres                      # PostgreSQL password
DB_DATABASE=jira_voicebot                 # PostgreSQL database name
DB_SSL=false                              # Enable SSL for database connection

# Authentication Configuration
JWT_SECRET=your-jwt-secret-key            # Secret for JWT signing
JWT_EXPIRATION=1d                         # JWT expiration time
REFRESH_TOKEN_EXPIRATION=7d               # Refresh token expiration

# JIRA API Configuration
JIRA_API_URL=https://your-domain.atlassian.net   # JIRA instance URL
JIRA_CLIENT_ID=your-jira-client-id               # JIRA OAuth client ID
JIRA_CLIENT_SECRET=your-jira-client-secret       # JIRA OAuth client secret

# OpenRouter API Configuration
OPENROUTER_API_KEY=your-openrouter-api-key       # OpenRouter API key
OPENROUTER_TRANSCRIPTION_MODEL=openai/whisper    # Model for transcription
OPENROUTER_COMMAND_MODEL=anthropic/claude-3-opus # Model for command processing
OPENROUTER_RESPONSE_MODEL=anthropic/claude-3-sonnet # Model for response generation
OPENROUTER_TTS_MODEL=elevenlabs/eleven-monolingual-v1 # Text-to-speech model

# Redis Configuration
REDIS_HOST=localhost                      # Redis host
REDIS_PORT=6379                           # Redis port
REDIS_PASSWORD=                           # Redis password

# Monitoring and Logging
LOG_LEVEL=info                            # Log level (error, warn, info, debug)
SENTRY_DSN=                               # Sentry DSN for error tracking
```

## 5. Deployment Architecture

### 5.1 Infrastructure

- **Frontend**: Static site generation with Next.js
- **Backend APIs**: NestJS applications deployed as containerized microservices
- **Database**: PostgreSQL with managed backup and failover capabilities
- **Cache Layer**: Redis for session management and frequent queries
- **Authentication**: Identity provider integration with JWT token management
- **Containerization**: Docker for consistent deployment across environments
- **Orchestration**: Kubernetes for container management and scaling
- **CI/CD Pipeline**: GitHub Actions for automated testing and deployment
- **Environment Management**: 
  - Development environment for active development
  - Staging environment for QA and testing
  - Production environment with high-availability configuration

### 5.2 Security Measures

- End-to-end encryption for sensitive data
- Regular security audits
- GDPR compliance for voice data
- Secure credential management via environment variables and secrets management
- Role-based access control
- Rate limiting to prevent abuse
- Security headers and CORS configuration
- Regular vulnerability scanning
- Intrusion detection systems

### 5.3 Monitoring and Maintenance

- **Logging**: Centralized logging with ELK stack
- **Metrics**: Prometheus for system metrics collection
- **Visualization**: Grafana dashboards for real-time monitoring
- **Alerts**: PagerDuty integration for critical issues
- **Performance**: Regular performance testing and optimization
- **Backups**: Automated database backups with point-in-time recovery
- **Disaster Recovery**: Cross-region replication for critical data

## 6. Performance Considerations

- Optimized voice recognition for varying accents and environments
- Low-latency command processing (<1s response time)
- Efficient API communication with JIRA
- Caching strategies for frequently accessed data
- Progressive loading for large datasets

## 7. Accessibility Features

- Voice-first approach for hands-free operation
- Screen reader compatibility
- Keyboard navigation support
- High contrast mode options
- Adjustable text sizes

## 8. Future Enhancements

- Advanced AI for predictive command suggestions
- Team collaboration through shared voice workspaces
- Custom command creation by users
- Multi-language support
- Integration with additional project management tools
- Offline mode with sync capability

## 9. Known Limitations in Current Version

- Limited to English language voice commands
- Requires stable internet connection for voice processing
- Some complex JIRA workflows may require UI interaction
- Background noise can impact recognition accuracy
- Complex reporting may have limited voice functionality

## 10. Support Resources

- In-app tutorial for voice command usage
- Command reference guide
- Troubleshooting voice recognition issues
- Support channels for technical assistance
- Regular updates and improvements

## 11. Implementation Timeline

### 11.1 Phase 1: MVP Launch (Month 1-2)

- **Frontend Development**:
  - Basic UI implementation (✓ Completed)
  - Authentication screens (✓ Completed)
  - Dashboard with key metrics (✓ Completed)
  - Voice activation button (✓ Completed)

- **Backend Development**:
  - NestJS server setup with core API endpoints (In Progress)
  - PostgreSQL database implementation (In Progress)
  - Initial TypeORM entity setup (In Progress)
  - Basic JIRA integration (To Do)

- **Voice Capabilities**:
  - Initial OpenRouter API integration (To Do)
  - Simple transcription using Whisper model (To Do)
  - Basic command parsing (To Do)

### 11.2 Phase 2: Enhanced Features (Month 3-4)

- **OpenRouter Integration**:
  - Full integration with multiple AI models
  - Command intent extraction with Claude 3 Opus
  - Natural language response generation
  - Voice synthesis integration

- **Backend Enhancement**:
  - Complete NestJS service implementation
  - Advanced querying capabilities
  - Redis caching implementation
  - Webhook processing for real-time updates
  - API expansion for reporting features

- **Voice Capabilities**:
  - Expanded command vocabulary
  - Contextual understanding improvements
  - Multi-step workflows
  - Voice settings customization

### 11.3 Phase 3: Advanced Intelligence (Month 5-6)

- **AI Enhancement**:
  - Advanced NLP capabilities via custom-trained models
  - Context-aware conversations
  - Predictive command suggestions
  - Command error correction

- **Integration Expansion**:
  - Additional JIRA features (Agile boards, epics)
  - Optional integrations with related tools
  - Advanced reporting capabilities
  - Custom workflow support

- **Enterprise Readiness**:
  - Advanced security features
  - Performance at scale
  - Custom deployment options
  - Advanced monitoring and analytics

### 11.4 Ongoing Maintenance and Improvement (Month 7+)

- Monthly feature updates based on user feedback
- Quarterly security audits
- Continuous model training and improvement
- Performance optimization based on usage patterns
- Expanded AI model capabilities through OpenRouter

## 12. Support Resources

- In-app tutorial for voice command usage
- Command reference guide
- Troubleshooting voice recognition issues
- Support channels for technical assistance
- Regular updates and improvements

## 13. Developer Resources

### 13.1 Development Environment Setup

```bash
# Clone the repository
git clone https://github.com/your-org/jira-voicebot.git

# Frontend setup
cd jira-voicebot
pnpm install
pnpm dev

# Database setup
docker-compose up -d postgres redis

# Backend setup
cd server
pnpm install
pnpm start:dev

# Environment configuration
cp .env.example .env.local
# Edit .env.local with your OpenRouter and JIRA API keys
```

### 13.2 Key API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User authentication |
| `/api/voice/process` | POST | Process voice command |
| `/api/tickets` | GET | List tickets with filtering |
| `/api/tickets` | POST | Create new ticket |
| `/api/projects` | GET | List all projects |
| `/api/voice-history` | GET | Get voice command history |

### 13.3 Development Workflow

1. **Feature Development**:
   - Create feature branch from `develop`
   - Implement feature with tests
   - Create pull request for review
   - Merge to `develop` after approval

2. **Release Process**:
   - Create release branch from `develop`
   - Perform QA testing
   - Fix any issues on release branch
   - Merge to `main` and tag with version
   - Deploy to production

3. **Testing Strategy**:
   - Unit tests for business logic
   - Integration tests for API endpoints
   - E2E tests for critical user flows
   - Voice command tests with recorded samples

### 13.4 Documentation Resources

- [API Documentation](https://api-docs.jiravoicebot.example) - Swagger API docs
- [Component Library](https://components.jiravoicebot.example) - UI component docs
- [Architecture Diagrams](https://architecture.jiravoicebot.example) - System design docs
- [Voice Command Guide](https://voice-commands.jiravoicebot.example) - Voice command reference 