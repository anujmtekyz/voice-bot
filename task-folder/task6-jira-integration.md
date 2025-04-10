# Task 6: JIRA Integration

This task focuses on implementing a comprehensive integration with JIRA, allowing users to connect their JIRA accounts, synchronize data, and manage JIRA projects and issues through voice commands and the web interface.

## Objectives
- Implement secure JIRA account connection and authentication
- Develop bidirectional synchronization between the application and JIRA
- Create APIs for JIRA project and issue management
- Implement JIRA user and field management
- Integrate JIRA capabilities with voice commands

## Subtasks

### 6.1 JIRA Connection and Authentication

- [ ] Implement JIRA OAuth integration
  - [ ] Set up OAuth 2.0 flow for JIRA Cloud
  - [ ] Create token storage with encryption
  - [ ] Implement token refresh mechanism
  - [ ] Add connection status monitoring
- [ ] Create JIRA connection service
  - [ ] Implement connection management
  - [ ] Add error handling for API failures
  - [ ] Create retry logic for failed requests
  - [ ] Implement connection pooling
- [ ] Set up JIRA connection controller
  - [ ] GET /api/jira/status - Check connection status
  - [ ] POST /api/jira/connect - Connect JIRA account
  - [ ] DELETE /api/jira/disconnect - Disconnect JIRA account
  - [ ] Implement OAuth callback handling

### 6.2 JIRA Data Synchronization

- [ ] Create synchronization infrastructure
  - [ ] Implement sync scheduling system
  - [ ] Set up incremental sync capabilities
  - [ ] Create conflict resolution strategies
  - [ ] Add sync logging and monitoring
- [ ] Implement project synchronization
  - [ ] Create project mapping between systems
  - [ ] Implement project metadata sync
  - [ ] Add project settings synchronization
  - [ ] Create project members sync
- [ ] Implement issue synchronization
  - [ ] Create issue mapping between systems
  - [ ] Implement issue fields sync
  - [ ] Add issue history synchronization
  - [ ] Create comment synchronization
- [ ] Set up synchronization controller
  - [ ] POST /api/jira/sync - Trigger manual sync
  - [ ] GET /api/jira/sync/status - Check sync status
  - [ ] GET /api/jira/sync/history - Get sync history
  - [ ] Implement webhook receivers for JIRA events

### 6.3 JIRA Project Management

- [ ] Implement project retrieval and caching
  - [ ] Create project data model
  - [ ] Implement project list fetching
  - [ ] Add project details retrieval
  - [ ] Create project caching mechanism
- [ ] Implement project-related services
  - [ ] Create project search functionality
  - [ ] Implement project filtering
  - [ ] Add project metadata management
  - [ ] Create project analytics
- [ ] Set up project management controller
  - [ ] GET /api/jira/projects - List projects
  - [ ] GET /api/jira/projects/:id - Get project details
  - [ ] GET /api/jira/projects/:id/issues - List project issues
  - [ ] GET /api/jira/projects/:id/members - List project members
  - [ ] POST /api/jira/projects/:id/issues - Create issue in project

### 6.4 JIRA Issue Management

- [ ] Implement issue CRUD operations
  - [ ] Create issue data model
  - [ ] Implement issue creation
  - [ ] Add issue update capabilities
  - [ ] Create issue status management
- [ ] Implement issue-related services
  - [ ] Create issue search and filtering
  - [ ] Implement issue assignment
  - [ ] Add issue comment management
  - [ ] Create issue transition handling
- [ ] Set up issue management controller
  - [ ] GET /api/jira/issues/:id - Get issue details
  - [ ] PUT /api/jira/issues/:id - Update issue
  - [ ] POST /api/jira/issues/:id/comments - Add comment
  - [ ] PUT /api/jira/issues/:id/status - Update status
  - [ ] PUT /api/jira/issues/:id/assign - Assign issue
  - [ ] GET /api/jira/issues/:id/transitions - Get transitions
  - [ ] POST /api/jira/issues/:id/transitions - Execute transition

### 6.5 JIRA Field Management

- [ ] Implement field metadata retrieval
  - [ ] Create field data models
  - [ ] Implement field options fetching
  - [ ] Add custom field support
  - [ ] Create field caching mechanism
- [ ] Implement field-related services
  - [ ] Create field mapping between systems
  - [ ] Implement field validation
  - [ ] Add field value transformation
  - [ ] Create field dependency handling
- [ ] Set up field management controller
  - [ ] GET /api/jira/fields - Get available fields
  - [ ] GET /api/jira/fields/options/:fieldId - Get field options
  - [ ] GET /api/jira/statuses - Get available statuses
  - [ ] GET /api/jira/priorities - Get priorities
  - [ ] GET /api/jira/issue-types - Get issue types

### 6.6 JIRA User Management

- [ ] Implement user retrieval and mapping
  - [ ] Create user data model
  - [ ] Implement user search
  - [ ] Add user mapping between systems
  - [ ] Create user caching
- [ ] Implement user-related services
  - [ ] Create assignable user filtering
  - [ ] Implement user permission checking
  - [ ] Add user activity tracking
  - [ ] Create user metrics collection
- [ ] Set up user management controller
  - [ ] GET /api/jira/users - Get JIRA users
  - [ ] GET /api/jira/users/search - Search users
  - [ ] GET /api/jira/users/assignable/:projectId - Get assignable users
  - [ ] GET /api/jira/users/current - Get current user info

### 6.7 Voice Command Integration for JIRA

- [ ] Implement JIRA-specific voice commands
  - [ ] Create command templates for JIRA operations
  - [ ] Implement intent recognition for JIRA commands
  - [ ] Add entity extraction for JIRA fields
  - [ ] Create command validation
- [ ] Develop JIRA command execution service
  - [ ] Create command mapping to JIRA API calls
  - [ ] Implement context-aware command execution
  - [ ] Add response formatting for voice feedback
  - [ ] Create error handling for voice commands
- [ ] Create JIRA-specific suggestion service
  - [ ] Implement context-aware JIRA suggestions
  - [ ] Add project-specific command suggestions
  - [ ] Create user preference-based suggestions
  - [ ] Implement analytics for suggestion improvement

## API Endpoints To Be Implemented:

```
# JIRA Connection
GET /api/jira/status - Check JIRA connection status
POST /api/jira/connect - Connect JIRA account
DELETE /api/jira/disconnect - Disconnect JIRA account

# JIRA Sync
POST /api/jira/sync - Manually sync data with JIRA
GET /api/jira/sync/status - Get sync status
GET /api/jira/sync/history - Get sync history

# JIRA Project Management
GET /api/jira/projects - Get projects from JIRA
GET /api/jira/projects/:id - Get specific project details from JIRA
GET /api/jira/projects/:id/issues - Get issues for a specific project from JIRA
POST /api/jira/projects/:id/issues - Create new issue in JIRA project
GET /api/jira/projects/:id/members - Get project members from JIRA

# JIRA Issue Management
GET /api/jira/issues/:id - Get specific issue details from JIRA
PUT /api/jira/issues/:id - Update issue in JIRA
POST /api/jira/issues/:id/comments - Add comment to JIRA issue
PUT /api/jira/issues/:id/status - Update issue status in JIRA
PUT /api/jira/issues/:id/assign - Assign issue to user in JIRA
GET /api/jira/issues/:id/transitions - Get available transitions for an issue
POST /api/jira/issues/:id/transitions - Execute a transition for an issue

# JIRA Issue Fields
GET /api/jira/fields - Get available issue fields from JIRA
GET /api/jira/fields/options/:fieldId - Get options for a specific field
GET /api/jira/statuses - Get available issue statuses from JIRA
GET /api/jira/priorities - Get available issue priorities from JIRA
GET /api/jira/issue-types - Get available issue types from JIRA

# JIRA Users
GET /api/jira/users - Get users from JIRA
GET /api/jira/users/search - Search for users in JIRA
GET /api/jira/users/assignable/:projectId - Get users that can be assigned to issues in a project
GET /api/jira/users/current - Get current user information from JIRA
```

## Request/Response Examples:

### Connect JIRA Account

**Request:**
```json
POST /api/jira/connect
{
  "jiraCloudInstance": "company.atlassian.net",
  "authType": "oauth2"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "authUrl": "https://auth.atlassian.com/authorize?client_id=your_client_id&...",
    "state": "random-state-string",
    "expiresIn": 600
  },
  "message": "Please complete the authentication process by visiting the provided URL"
}
```

### Get JIRA Projects

**Request:**
```
GET /api/jira/projects?limit=10&startAt=0&search=marketing
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "10000",
        "key": "MARK",
        "name": "Marketing Project",
        "projectTypeKey": "software",
        "avatarUrls": {
          "48x48": "https://company.atlassian.net/secure/projectavatar?...",
          "24x24": "https://company.atlassian.net/secure/projectavatar?..."
        },
        "simplified": true,
        "lastSyncTime": "2023-10-15T14:30:45Z",
        "issueCount": 128
      },
      {
        "id": "10002",
        "key": "MKT",
        "name": "Market Research",
        "projectTypeKey": "business",
        "avatarUrls": {
          "48x48": "https://company.atlassian.net/secure/projectavatar?...",
          "24x24": "https://company.atlassian.net/secure/projectavatar?..."
        },
        "simplified": false,
        "lastSyncTime": "2023-10-15T13:15:22Z",
        "issueCount": 56
      }
    ],
    "pagination": {
      "totalItems": 2,
      "itemsPerPage": 10,
      "currentPage": 1,
      "totalPages": 1
    }
  }
}
```

### Create Issue in Project

**Request:**
```json
POST /api/jira/projects/10000/issues
{
  "summary": "Implement new login flow",
  "description": "We need to implement a new login flow with better security.",
  "issueType": "Task",
  "priority": "Medium",
  "assignee": "user123",
  "labels": ["ux", "security"],
  "customFields": {
    "customfield_10001": "Value 1",
    "customfield_10002": ["Value 2", "Value 3"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "12345",
    "key": "MARK-123",
    "self": "https://company.atlassian.net/rest/api/3/issue/12345",
    "summary": "Implement new login flow",
    "issueType": "Task",
    "priority": "Medium",
    "status": "To Do",
    "assignee": {
      "id": "user123",
      "displayName": "John Smith",
      "avatarUrl": "https://company.atlassian.net/secure/useravatar?..."
    },
    "created": "2023-10-16T09:23:45Z",
    "updated": "2023-10-16T09:23:45Z"
  },
  "message": "Issue created successfully"
}
```

### Get Issue Details

**Request:**
```
GET /api/jira/issues/MARK-123
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "12345",
    "key": "MARK-123",
    "summary": "Implement new login flow",
    "description": "We need to implement a new login flow with better security.",
    "issueType": {
      "id": "10002",
      "name": "Task",
      "iconUrl": "https://company.atlassian.net/images/icons/issuetypes/task.svg"
    },
    "priority": {
      "id": "3",
      "name": "Medium",
      "iconUrl": "https://company.atlassian.net/images/icons/priorities/medium.svg"
    },
    "status": {
      "id": "10000",
      "name": "To Do",
      "category": "to-do"
    },
    "assignee": {
      "id": "user123",
      "displayName": "John Smith",
      "avatarUrl": "https://company.atlassian.net/secure/useravatar?..."
    },
    "reporter": {
      "id": "user456",
      "displayName": "Jane Doe",
      "avatarUrl": "https://company.atlassian.net/secure/useravatar?..."
    },
    "created": "2023-10-16T09:23:45Z",
    "updated": "2023-10-16T09:23:45Z",
    "comments": [
      {
        "id": "10001",
        "author": {
          "id": "user456",
          "displayName": "Jane Doe"
        },
        "body": "We should consider implementing 2FA as part of this.",
        "created": "2023-10-16T10:15:22Z"
      }
    ],
    "labels": ["ux", "security"],
    "customFields": {
      "customfield_10001": "Value 1",
      "customfield_10002": ["Value 2", "Value 3"]
    },
    "transitions": [
      {
        "id": "11",
        "name": "Start Progress",
        "to": {
          "id": "10001",
          "name": "In Progress"
        }
      }
    ]
  }
}
```

### Get Available Fields

**Request:**
```
GET /api/jira/fields
```

**Response:**
```json
{
  "success": true,
  "data": {
    "standardFields": [
      {
        "id": "summary",
        "name": "Summary",
        "type": "string",
        "required": true
      },
      {
        "id": "description",
        "name": "Description",
        "type": "string",
        "required": false
      },
      {
        "id": "assignee",
        "name": "Assignee",
        "type": "user",
        "required": false
      }
    ],
    "customFields": [
      {
        "id": "customfield_10001",
        "name": "Story Points",
        "type": "number",
        "required": false
      },
      {
        "id": "customfield_10002",
        "name": "Epic Link",
        "type": "epic",
        "required": false
      }
    ]
  }
}
```

## Verification Criteria
- JIRA account connection and authentication works securely
- Data synchronization between the application and JIRA works bidirectionally
- JIRA projects and issues can be retrieved and managed
- JIRA fields are properly mapped and handled
- Voice commands can successfully perform JIRA operations
- All API endpoints comply with the standard response format
- Rate limiting and error handling for JIRA API is implemented properly
- JIRA webhook integration works for real-time updates

## Dependencies
- Task 1: Core Infrastructure Setup
- Task 2: Authentication and User Management
- Task 4: Voice Processing Infrastructure
- Task 5: Voice Command History and Settings
- JIRA API knowledge
- OAuth 2.0 implementation experience

## Estimated Time
- 6-7 days 