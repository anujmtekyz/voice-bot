# JIRA Voice Bot - API Requirements

This document outlines all API endpoints required to support the JIRA Voice Bot application based on analysis of the UI screenshots.

## Introduction

### API Implementation Approach

All APIs will be implemented using the NestJS framework with a RESTful design pattern. The APIs will follow these general guidelines:

1. **Base URL**: All API endpoints will be prefixed with `/api/v1` to allow for versioning
2. **JSON Format**: All requests and responses will use JSON format
3. **HTTP Methods**:
   - GET - Retrieve data
   - POST - Create new resources
   - PUT - Update existing resources
   - DELETE - Remove resources
4. **Status Codes**:
   - 200 - Success
   - 201 - Created
   - 204 - No Content (for successful operations that return no data)
   - 400 - Bad Request
   - 401 - Unauthorized
   - 403 - Forbidden
   - 404 - Not Found
   - 500 - Server Error

### Authentication and Authorization

All API endpoints (except public endpoints like login and forgot password) will require authentication using JWT (JSON Web Tokens). The authentication flow includes:

1. **Token-based Authentication**:
   - Access tokens (short-lived, 15-30 minutes)
   - Refresh tokens (longer-lived, 7 days)
   - Token should be passed in the Authorization header: `Authorization: Bearer <token>`

2. **Role-based Authorization**:
   - Regular User - Basic access to tickets, projects, and reports
   - Project Manager - Advanced project management capabilities
   - Administrator - Full system access including user management

### Standard Response Format

All API responses will follow a standardized format:

```json
{
  "success": true,
  "data": { /* Response data */ },
  "message": "Optional success message",
  "errors": [] // Empty if no errors
}
```

Error responses:

```json
{
  "success": false,
  "data": null,
  "message": "Error summary",
  "errors": [
    {
      "code": "ERROR_CODE",
      "field": "field_name", // Optional
      "message": "Detailed error message"
    }
  ]
}
```

### Pagination Format

Paginated endpoints will return data in the following format:

```json
{
  "success": true,
  "data": {
    "items": [ /* Array of items */ ],
    "meta": {
      "totalItems": 100,
      "itemCount": 10,
      "itemsPerPage": 10,
      "totalPages": 10,
      "currentPage": 1
    },
    "links": {
      "first": "/api/resource?page=1",
      "previous": null,
      "next": "/api/resource?page=2",
      "last": "/api/resource?page=10"
    }
  }
}
```

## 1. Authentication APIs

### 1.1 User Authentication
- `POST /api/auth/login` - User login with email/password
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh authentication token
- `POST /api/auth/forgot-password` - Initiate password reset
- `POST /api/auth/reset-password` - Complete password reset with token
- `GET /api/auth/me` - Get current user information

## 2. Dashboard APIs

### 2.1 Dashboard Data
- `GET /api/dashboard/summary` - Get dashboard summary metrics
- `GET /api/dashboard/recent-activity` - Get recent user and system activity
- `GET /api/dashboard/tickets-summary` - Get tickets summary by status/priority
- `GET /api/dashboard/projects-summary` - Get projects summary

## 3. Ticket Management APIs

### 3.1 Tickets
- `GET /api/tickets` - List tickets with filtering, sorting, and pagination
- `GET /api/tickets/:id` - Get specific ticket details
- `POST /api/tickets` - Create new ticket
- `PUT /api/tickets/:id` - Update ticket information
- `DELETE /api/tickets/:id` - Delete a ticket

### 3.2 Ticket Comments
- `GET /api/tickets/:id/comments` - Get comments for a ticket
- `POST /api/tickets/:id/comments` - Add comment to a ticket
- `PUT /api/tickets/:id/comments/:commentId` - Update a comment
- `DELETE /api/tickets/:id/comments/:commentId` - Delete a comment

### 3.3 Ticket Status
- `PUT /api/tickets/:id/status` - Update ticket status
- `GET /api/tickets/statuses` - Get available ticket statuses

### 3.4 Ticket Assignment
- `PUT /api/tickets/:id/assign` - Assign ticket to user
- `GET /api/tickets/assignable-users` - Get users who can be assigned tickets

## 4. Project Management APIs

### 4.1 Projects
- `GET /api/projects` - List all projects with filtering and pagination
- `GET /api/projects/:id` - Get specific project details
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project information
- `DELETE /api/projects/:id` - Delete a project

### 4.2 Project Members
- `GET /api/projects/:id/members` - List project team members
- `POST /api/projects/:id/members` - Add member to project
- `DELETE /api/projects/:id/members/:userId` - Remove member from project

## 5. Voice Command APIs

### 5.1 Voice Processing
- `POST /api/voice/process` - Process voice command audio/transcript
- `GET /api/voice/commands` - Get list of available voice commands
- `GET /api/voice/suggestions` - Get command suggestions based on context

#### 5.1.1 Voice Command Processing API Details

**Endpoint**: `POST /api/voice/process`

**Description**: Process voice command from audio or text transcript and execute the corresponding action

**Request Body**:
```json
{
  "type": "audio", // "audio" or "text"
  "content": "base64_audio_data", // or text transcript if type is "text"
  "format": "wav", // audio format if type is "audio", optional
  "context": { // optional context for more accurate processing
    "currentPage": "tickets",
    "selectedItem": "PROJ-123"
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "commandId": "cmd-123456",
    "transcript": "Assign ticket PROJ-123 to David",
    "intent": "assign_ticket",
    "entities": {
      "ticketId": "PROJ-123",
      "assignee": "David"
    },
    "action": {
      "type": "ticket_assignment",
      "status": "completed"
    },
    "response": {
      "text": "Ticket PROJ-123 has been assigned to David",
      "speech": "base64_audio_data" // optional, only if speech response requested
    }
  }
}
```

**Endpoint**: `GET /api/voice/commands`

**Description**: Get list of available voice commands and examples

**Query Parameters**:
- `category` (optional): Filter commands by category
- `search` (optional): Search term for commands

**Response**:
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "name": "Tickets",
        "commands": [
          {
            "intent": "create_ticket",
            "examples": [
              "Create bug ticket for login issue",
              "New task for API integration"
            ],
            "parameters": [
              {
                "name": "ticketType",
                "type": "string",
                "required": true,
                "options": ["bug", "task", "story"]
              },
              {
                "name": "summary",
                "type": "string",
                "required": true
              }
            ]
          },
          // More commands
        ]
      },
      // More categories
    ]
  }
}
```

### 5.2 Voice History
- `GET /api/voice/history` - Get voice command history with filtering and pagination
- `DELETE /api/voice/history/:id` - Delete specific voice command history entry
- `DELETE /api/voice/history` - Clear all voice command history

#### 5.2.1 Voice History API Details

**Endpoint**: `GET /api/voice/history`

**Description**: Get user's voice command history with filtering and pagination

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `startDate` (optional): Filter by start date
- `endDate` (optional): Filter by end date
- `status` (optional): Filter by command status (success, failed)
- `intent` (optional): Filter by command intent

**Response**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "hist-123456",
        "transcript": "Assign ticket PROJ-123 to David",
        "intent": "assign_ticket",
        "status": "success",
        "createdAt": "2025-04-09T13:15:30Z",
        "response": "Ticket PROJ-123 has been assigned to David"
      },
      // More history items
    ],
    "meta": {
      "totalItems": 50,
      "itemCount": 10,
      "itemsPerPage": 10,
      "totalPages": 5,
      "currentPage": 1
    }
  }
}
```

### 5.3 Voice Settings
- `GET /api/voice/settings` - Get user voice settings
- `PUT /api/voice/settings` - Update user voice settings

#### 5.3.1 Voice Settings API Details

**Endpoint**: `GET /api/voice/settings`

**Description**: Get user's voice recognition settings

**Response**:
```json
{
  "success": true,
  "data": {
    "voiceActivation": true,
    "sensitivity": 0.7,
    "language": "en-US",
    "voiceResponseEnabled": true,
    "voiceResponseVolume": 0.8,
    "wakeWord": "Hey Assistant",
    "customCommands": [
      {
        "phrase": "show my bugs",
        "action": {
          "type": "navigation",
          "target": "/tickets?type=bug&assignee=me"
        }
      }
    ],
    "privacySettings": {
      "storeHistory": true,
      "historyRetentionDays": 30,
      "filterSensitiveInfo": true
    }
  }
}
```

**Endpoint**: `PUT /api/voice/settings`

**Description**: Update user's voice recognition settings

**Request Body**:
```json
{
  "voiceActivation": true,
  "sensitivity": 0.8,
  "language": "en-US",
  "voiceResponseEnabled": true,
  "voiceResponseVolume": 0.7,
  "wakeWord": "Hey Jira",
  "customCommands": [
    {
      "phrase": "show critical bugs",
      "action": {
        "type": "navigation",
        "target": "/tickets?type=bug&priority=critical"
      }
    }
  ],
  "privacySettings": {
    "storeHistory": true,
    "historyRetentionDays": 60,
    "filterSensitiveInfo": true
  }
}
```

### 5.4 OpenRouter Integration APIs
- `POST /api/voice/transcribe` - Convert audio to text using OpenRouter and Whisper model
- `POST /api/voice/interpret` - Process transcribed text to extract intent and entities using Claude 3
- `POST /api/voice/generate-response` - Generate natural language response for voice command
- `POST /api/voice/text-to-speech` - Convert text response to speech using ElevenLabs
- `GET /api/voice/models` - Get available AI models for voice processing
- `POST /api/voice/streaming-response` - Stream voice command processing for real-time feedback
- `GET /api/voice/usage` - Get AI model usage statistics and limits

#### 5.4.1 OpenRouter API Details

**Endpoint**: `POST /api/voice/transcribe`

**Description**: Convert audio to text using OpenRouter and Whisper model

**Request Body**:
```json
{
  "audio": "base64_audio_data",
  "format": "wav",
  "model": "openai/whisper-large-v3", // optional, default is the configured model
  "language": "en" // optional, auto-detected if not specified
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "transcript": "Create a new bug ticket for the login page issue",
    "confidence": 0.95,
    "processingTime": 1.2 // seconds
  }
}
```

**Endpoint**: `POST /api/voice/interpret`

**Description**: Process transcribed text to extract intent and entities using Claude 3

**Request Body**:
```json
{
  "transcript": "Create a new bug ticket for the login page issue",
  "context": { // optional context
    "currentPage": "dashboard"
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "intent": "create_ticket",
    "confidence": 0.92,
    "entities": {
      "ticketType": "bug",
      "summary": "login page issue"
    },
    "requiredParameters": [], // empty if all required parameters are present
    "processingTime": 0.8 // seconds
  }
}
```

**Endpoint**: `GET /api/voice/models`

**Description**: Get available AI models for voice processing

**Response**:
```json
{
  "success": true,
  "data": {
    "transcription": [
      {
        "id": "openai/whisper-large-v3",
        "name": "Whisper Large v3",
        "provider": "OpenAI",
        "isDefault": true,
        "supportedLanguages": ["en", "es", "fr", "de", "ja", "zh"]
      }
    ],
    "interpretation": [
      {
        "id": "anthropic/claude-3-opus",
        "name": "Claude 3 Opus",
        "provider": "Anthropic",
        "isDefault": true
      },
      {
        "id": "anthropic/claude-3-sonnet",
        "name": "Claude 3 Sonnet",
        "provider": "Anthropic",
        "isDefault": false
      }
    ],
    "textToSpeech": [
      {
        "id": "elevenlabs/eleven-monolingual-v1",
        "name": "ElevenLabs",
        "provider": "ElevenLabs",
        "isDefault": true,
        "voices": ["Rachel", "Dave", "Emily", "Josh"]
      }
    ]
  }
}
```

**Endpoint**: `GET /api/voice/usage`

**Description**: Get AI model usage statistics and limits

**Response**:
```json
{
  "success": true,
  "data": {
    "currentPeriod": {
      "startDate": "2025-04-01T00:00:00Z",
      "endDate": "2025-04-30T23:59:59Z",
      "transcription": {
        "requestCount": 152,
        "audioSeconds": 1250,
        "limit": 10000
      },
      "interpretation": {
        "requestCount": 145,
        "tokensUsed": 25840,
        "limit": 100000
      },
      "textToSpeech": {
        "requestCount": 98,
        "charactersConverted": 12500,
        "limit": 50000
      }
    },
    "costEstimate": {
      "currency": "USD",
      "currentPeriodCost": 4.85,
      "projectedMonthlyCost": 15.25
    }
  }
}
```

## 6. Reporting APIs

### 6.1 Report Generation
- `GET /api/reports` - Get list of available reports
- `GET /api/reports/:type` - Generate specific report
- `GET /api/reports/custom` - Generate custom report with parameters

### 6.2 Report Data
- `GET /api/reports/data/tickets-by-status` - Get ticket counts by status
- `GET /api/reports/data/tickets-by-priority` - Get ticket counts by priority
- `GET /api/reports/data/velocity` - Get team velocity data
- `GET /api/reports/data/burndown` - Get burndown chart data

### 6.3 Report Export
- `GET /api/reports/export/:type` - Export report in specified format (PDF, CSV, etc.)

## 7. User Management APIs

### 7.1 User Profile
- `GET /api/users/profile` - Get user profile information
- `PUT /api/users/profile` - Update user profile information
- `PUT /api/users/password` - Change user password

### 7.2 User Preferences
- `GET /api/users/preferences` - Get user preferences
- `PUT /api/users/preferences` - Update user preferences

### 7.3 User Management (Admin)
- `GET /api/admin/users` - List all users (admin only)
- `POST /api/admin/users` - Create new user (admin only)
- `PUT /api/admin/users/:id` - Update user (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)

## 8. JIRA Integration APIs

### 8.1 JIRA Connection
- `GET /api/jira/status` - Check JIRA connection status
- `POST /api/jira/connect` - Connect JIRA account
- `DELETE /api/jira/disconnect` - Disconnect JIRA account

### 8.2 JIRA Sync
- `POST /api/jira/sync` - Manually sync data with JIRA
- `GET /api/jira/sync/status` - Get sync status
- `GET /api/jira/sync/history` - Get sync history

### 8.3 JIRA Project Management
- `GET /api/jira/projects` - Get projects from JIRA
- `GET /api/jira/projects/:id` - Get specific project details from JIRA
- `GET /api/jira/projects/:id/issues` - Get issues for a specific project from JIRA
- `POST /api/jira/projects/:id/issues` - Create new issue in JIRA project
- `GET /api/jira/projects/:id/members` - Get project members from JIRA

### 8.4 JIRA Issue Management
- `GET /api/jira/issues/:id` - Get specific issue details from JIRA
- `PUT /api/jira/issues/:id` - Update issue in JIRA
- `POST /api/jira/issues/:id/comments` - Add comment to JIRA issue
- `PUT /api/jira/issues/:id/status` - Update issue status in JIRA
- `PUT /api/jira/issues/:id/assign` - Assign issue to user in JIRA
- `GET /api/jira/issues/:id/transitions` - Get available transitions for an issue
- `POST /api/jira/issues/:id/transitions` - Execute a transition for an issue

### 8.5 JIRA Issue Fields
- `GET /api/jira/fields` - Get available issue fields from JIRA
- `GET /api/jira/fields/options/:fieldId` - Get options for a specific field
- `GET /api/jira/statuses` - Get available issue statuses from JIRA
- `GET /api/jira/priorities` - Get available issue priorities from JIRA
- `GET /api/jira/issue-types` - Get available issue types from JIRA

### 8.6 JIRA Users
- `GET /api/jira/users` - Get users from JIRA
- `GET /api/jira/users/:id` - Get specific user details from JIRA
- `GET /api/jira/users/search` - Search for JIRA users

### 8.7 JIRA Reporting
- `GET /api/jira/reports/velocity` - Get velocity report data from JIRA
- `GET /api/jira/reports/burndown` - Get burndown chart data from JIRA
- `GET /api/jira/reports/created-vs-resolved` - Get created vs. resolved issues report

## 9. System APIs

### 9.1 System Status
- `GET /api/system/status` - Get system status
- `GET /api/system/version` - Get application version

### 9.2 Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read

## 10. Miscellaneous APIs

### 10.1 Search
- `GET /api/search` - Global search across tickets, projects, and users

### 10.2 File Management
- `POST /api/files/upload` - Upload file attachment
- `GET /api/files/:id` - Download file
- `DELETE /api/files/:id` - Delete file

## 11. Conclusion and Implementation Strategy

### 11.1 API Implementation Priorities

Based on the screenshots and UI analysis, the following priority tiers are recommended for API implementation:

#### Priority 1: Core Infrastructure & Authentication (Sprint 1)
- Authentication APIs
- Database connections
- NestJS framework setup
- Base user management
- Initial JIRA integration endpoints

#### Priority 2: Essential Features (Sprint 2)
- Dashboard APIs
- Basic ticket management
- Project listing and details
- Initial voice command processing

#### Priority 3: Voice Processing (Sprint 3)
- OpenRouter integration
- Voice transcription and interpretation
- Voice command execution
- Voice history tracking

#### Priority 4: Advanced Features (Sprint 4)
- Reporting APIs
- Advanced JIRA integration
- Voice settings and customization
- Performance optimizations

### 11.2 API Architecture Diagram

The API architecture diagram should include:

1. **Client Layer**:
   - Next.js frontend
   - Web Speech API integration
   - State management

2. **API Gateway Layer**:
   - NestJS controllers
   - JWT authentication
   - Request validation
   - Rate limiting

3. **Business Logic Layer**:
   - NestJS services
   - Voice command processing
   - JIRA integration services
   - Reporting services

4. **Data Access Layer**:
   - TypeORM repositories
   - PostgreSQL database
   - Redis cache

5. **External Services Layer**:
   - OpenRouter API integration
   - JIRA API integration
   - File storage services

### 11.3 Next Steps

1. **API Specification Documentation**:
   - Create detailed OpenAPI (Swagger) specification
   - Document request/response examples for all endpoints
   - Define data models and validation rules

2. **Development Environment Setup**:
   - Configure NestJS application
   - Set up PostgreSQL database
   - Configure Redis for caching
   - Create Docker development environment

3. **Implementation Planning**:
   - Break down endpoints into technical tasks
   - Assign story points and developer resources
   - Create implementation timeline
   - Define testing strategy

4. **Integration Testing Strategy**:
   - Define test cases for each endpoint
   - Create automated tests for critical paths
   - Set up CI/CD pipeline for testing

By implementing these APIs, the JIRA Voice Bot application will provide a comprehensive voice-activated interface for JIRA ticket management, leveraging the power of OpenRouter for advanced natural language processing and voice recognition capabilities. 