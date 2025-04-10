# JIRA Voice Bot Database Schema Plan

## Overview
This document outlines the database schema design for the JIRA Voice Bot application. The schema is designed to support all the functionality described in the API requirements, including user management, authentication, JIRA integration, voice command processing, and reporting.

## Entity Relationship Diagram
```
Users ────┬─── UserSettings
          │
          ├─── RefreshTokens
          │
          ├─── VoiceCommandHistory ─── VoiceEntities
          │
          ├─── Projects ─┬─── Issues
          │              │
          │              └─── Sprints
          │
          └─── Reports
```

## Tables and Relationships

### Users
- **id**: UUID (PK)
- **email**: VARCHAR(255) (UNIQUE)
- **password**: VARCHAR(255)
- **firstName**: VARCHAR(100)
- **lastName**: VARCHAR(100)
- **role**: ENUM ('USER', 'PROJECT_MANAGER', 'ADMIN')
- **jiraApiToken**: VARCHAR(255)
- **jiraEmail**: VARCHAR(255)
- **jiraServerUrl**: VARCHAR(255)
- **isEmailVerified**: BOOLEAN
- **lastLoginAt**: TIMESTAMP
- **createdAt**: TIMESTAMP
- **updatedAt**: TIMESTAMP

### UserSettings
- **id**: UUID (PK)
- **userId**: UUID (FK -> Users.id)
- **voiceActivation**: BOOLEAN
- **voiceSensitivity**: FLOAT
- **preferredLanguage**: VARCHAR(10)
- **theme**: VARCHAR(50)
- **notifications**: JSONB
- **dashboardLayout**: JSONB
- **createdAt**: TIMESTAMP
- **updatedAt**: TIMESTAMP

### RefreshTokens
- **id**: UUID (PK)
- **userId**: UUID (FK -> Users.id)
- **token**: VARCHAR(500)
- **expiresAt**: TIMESTAMP
- **isRevoked**: BOOLEAN
- **createdAt**: TIMESTAMP
- **userAgent**: VARCHAR(255)
- **ipAddress**: VARCHAR(50)

### VoiceCommandHistory
- **id**: UUID (PK)
- **userId**: UUID (FK -> Users.id)
- **transcript**: TEXT
- **intent**: VARCHAR(100)
- **confidence**: FLOAT
- **status**: ENUM ('PROCESSING', 'COMPLETED', 'FAILED')
- **responseText**: TEXT
- **audioFormat**: VARCHAR(50)
- **processingTime**: INTEGER
- **createdAt**: TIMESTAMP
- **metadata**: JSONB

### VoiceEntities
- **id**: UUID (PK)
- **commandId**: UUID (FK -> VoiceCommandHistory.id)
- **name**: VARCHAR(100)
- **value**: TEXT
- **confidence**: FLOAT
- **startPosition**: INTEGER
- **endPosition**: INTEGER

### Projects
- **id**: UUID (PK)
- **jiraProjectId**: VARCHAR(100) (UNIQUE)
- **name**: VARCHAR(255)
- **key**: VARCHAR(50)
- **description**: TEXT
- **leadId**: UUID (FK -> Users.id)
- **category**: VARCHAR(100)
- **avatarUrl**: VARCHAR(255)
- **lastSyncAt**: TIMESTAMP
- **createdAt**: TIMESTAMP
- **updatedAt**: TIMESTAMP
- **metadata**: JSONB

### Issues
- **id**: UUID (PK)
- **jiraIssueId**: VARCHAR(100) (UNIQUE)
- **projectId**: UUID (FK -> Projects.id)
- **summary**: VARCHAR(255)
- **description**: TEXT
- **type**: VARCHAR(50)
- **priority**: VARCHAR(50)
- **status**: VARCHAR(50)
- **assigneeId**: UUID (FK -> Users.id)
- **reporterId**: UUID (FK -> Users.id)
- **createdAt**: TIMESTAMP
- **updatedAt**: TIMESTAMP
- **dueDate**: TIMESTAMP
- **estimatedHours**: FLOAT
- **sprintId**: UUID (FK -> Sprints.id)
- **labels**: TEXT[]
- **components**: TEXT[]
- **watchers**: UUID[] (FK -> Users.id)
- **metadata**: JSONB

### Sprints
- **id**: UUID (PK)
- **jiraSprintId**: VARCHAR(100) (UNIQUE)
- **projectId**: UUID (FK -> Projects.id)
- **name**: VARCHAR(255)
- **goal**: TEXT
- **startDate**: TIMESTAMP
- **endDate**: TIMESTAMP
- **status**: VARCHAR(50)
- **createdAt**: TIMESTAMP
- **updatedAt**: TIMESTAMP
- **completedAt**: TIMESTAMP

### Reports
- **id**: UUID (PK)
- **userId**: UUID (FK -> Users.id)
- **name**: VARCHAR(255)
- **description**: TEXT
- **type**: VARCHAR(100)
- **parameters**: JSONB
- **resultData**: JSONB
- **scheduledAt**: TIMESTAMP
- **lastRunAt**: TIMESTAMP
- **createdAt**: TIMESTAMP
- **updatedAt**: TIMESTAMP
- **isPublic**: BOOLEAN

### Notifications
- **id**: UUID (PK)
- **userId**: UUID (FK -> Users.id)
- **title**: VARCHAR(255)
- **message**: TEXT
- **type**: VARCHAR(100)
- **isRead**: BOOLEAN
- **createdAt**: TIMESTAMP
- **relatedEntityId**: UUID
- **relatedEntityType**: VARCHAR(100)

## Indexes
- Users: email, role
- RefreshTokens: userId, token
- VoiceCommandHistory: userId, intent, createdAt
- Projects: jiraProjectId, name, leadId
- Issues: jiraIssueId, projectId, assigneeId, status, sprintId
- Sprints: jiraSprintId, projectId, status
- Reports: userId, type, scheduledAt
- Notifications: userId, isRead, createdAt

## Notes on Implementation
- Use TypeORM's UUID generator for primary keys
- Implement soft delete where appropriate
- Use transactions for operations that affect multiple tables
- Consider adding database-level constraints for data integrity
- Add appropriate indexes based on query patterns
- Store complex JSON structures in JSONB columns for flexibility
- Use migrations for all schema changes to maintain database versioning 