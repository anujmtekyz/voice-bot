# JIRA Voice Bot - Service Architecture

This document outlines all the NestJS services required to implement the JIRA Voice Bot application, based on the API requirements.

## 1. Core Services

### 1.1 AuthService
**Responsibility**: Handle user authentication, token management, and security.
**Key Methods**:
- `login(credentials: LoginDto): Promise<AuthResponseDto>`
- `logout(userId: string): Promise<void>`
- `refreshToken(token: string): Promise<AuthResponseDto>`
- `forgotPassword(email: string): Promise<void>`
- `resetPassword(resetData: ResetPasswordDto): Promise<void>`
- `getCurrentUser(userId: string): Promise<UserDto>`
- `validateToken(token: string): Promise<TokenPayload>`

### 1.2 UserService
**Responsibility**: Manage user profiles, preferences, and account settings.
**Key Methods**:
- `getProfile(userId: string): Promise<UserProfileDto>`
- `updateProfile(userId: string, data: UpdateProfileDto): Promise<UserProfileDto>`
- `changePassword(userId: string, data: ChangePasswordDto): Promise<void>`
- `getPreferences(userId: string): Promise<UserPreferencesDto>`
- `updatePreferences(userId: string, data: UpdatePreferencesDto): Promise<UserPreferencesDto>`
- `getAllUsers(): Promise<UserDto[]>` (admin)
- `createUser(data: CreateUserDto): Promise<UserDto>` (admin)
- `updateUser(userId: string, data: UpdateUserDto): Promise<UserDto>` (admin)
- `deleteUser(userId: string): Promise<void>` (admin)

### 1.3 DashboardService
**Responsibility**: Aggregate and provide summary data for the dashboard.
**Key Methods**:
- `getSummary(userId: string): Promise<DashboardSummaryDto>`
- `getRecentActivity(userId: string): Promise<ActivityItemDto[]>`
- `getTicketsSummary(userId: string): Promise<TicketsSummaryDto>`
- `getProjectsSummary(userId: string): Promise<ProjectsSummaryDto>`

## 2. Ticket and Project Services

### 2.1 TicketService
**Responsibility**: Manage ticket CRUD operations and related functionality.
**Key Methods**:
- `getTickets(filters: TicketFilterDto): Promise<PaginatedResponse<TicketDto>>`
- `getTicketById(ticketId: string): Promise<TicketDetailDto>`
- `createTicket(data: CreateTicketDto): Promise<TicketDto>`
- `updateTicket(ticketId: string, data: UpdateTicketDto): Promise<TicketDto>`
- `deleteTicket(ticketId: string): Promise<void>`
- `updateTicketStatus(ticketId: string, status: string): Promise<TicketDto>`
- `assignTicket(ticketId: string, userId: string): Promise<TicketDto>`
- `getAvailableStatuses(): Promise<StatusDto[]>`
- `getAssignableUsers(): Promise<UserDto[]>`

### 2.2 TicketCommentService
**Responsibility**: Handle ticket comments management.
**Key Methods**:
- `getComments(ticketId: string): Promise<CommentDto[]>`
- `addComment(ticketId: string, data: AddCommentDto): Promise<CommentDto>`
- `updateComment(commentId: string, data: UpdateCommentDto): Promise<CommentDto>`
- `deleteComment(commentId: string): Promise<void>`

### 2.3 ProjectService
**Responsibility**: Manage project CRUD operations and related functionality.
**Key Methods**:
- `getProjects(filters: ProjectFilterDto): Promise<PaginatedResponse<ProjectDto>>`
- `getProjectById(projectId: string): Promise<ProjectDetailDto>`
- `createProject(data: CreateProjectDto): Promise<ProjectDto>`
- `updateProject(projectId: string, data: UpdateProjectDto): Promise<ProjectDto>`
- `deleteProject(projectId: string): Promise<void>`
- `getProjectMembers(projectId: string): Promise<UserDto[]>`
- `addProjectMember(projectId: string, userId: string): Promise<void>`
- `removeProjectMember(projectId: string, userId: string): Promise<void>`

## 3. Voice Command Services

### 3.1 VoiceProcessingService
**Responsibility**: Process voice commands, handle intent recognition, and execute actions.
**Key Methods**:
- `processCommand(data: ProcessCommandDto): Promise<CommandResponseDto>`
- `getAvailableCommands(category?: string): Promise<CommandCategoryDto[]>`
- `getCommandSuggestions(context: CommandContextDto): Promise<CommandSuggestionDto[]>`

### 3.2 VoiceHistoryService
**Responsibility**: Manage the history of voice commands for users.
**Key Methods**:
- `getHistory(userId: string, filters: HistoryFilterDto): Promise<PaginatedResponse<VoiceHistoryItemDto>>`
- `deleteHistoryItem(historyItemId: string): Promise<void>`
- `clearHistory(userId: string): Promise<void>`
- `recordCommandHistory(userId: string, data: RecordHistoryDto): Promise<void>`

### 3.3 VoiceSettingsService
**Responsibility**: Manage user-specific voice recognition settings.
**Key Methods**:
- `getSettings(userId: string): Promise<VoiceSettingsDto>`
- `updateSettings(userId: string, data: UpdateVoiceSettingsDto): Promise<VoiceSettingsDto>`
- `addCustomCommand(userId: string, data: CustomCommandDto): Promise<void>`
- `removeCustomCommand(userId: string, commandId: string): Promise<void>`

### 3.4 OpenRouterService
**Responsibility**: Interface with OpenRouter API for AI model access.
**Key Methods**:
- `transcribe(audioData: AudioDataDto): Promise<TranscriptionResultDto>`
- `interpretText(text: string, context?: any): Promise<InterpretationResultDto>`
- `generateResponse(intentData: IntentDataDto): Promise<ResponseGenerationDto>`
- `textToSpeech(text: string, voice?: string): Promise<AudioResponseDto>`
- `getAvailableModels(): Promise<ModelsListDto>`
- `streamResponse(command: StreamCommandDto): Observable<StreamingResponseDto>`
- `getUsageStatistics(userId: string): Promise<UsageStatisticsDto>`

## 4. JIRA Integration Services

### 4.1 JiraConnectionService
**Responsibility**: Manage connection to JIRA API and authentication.
**Key Methods**:
- `getConnectionStatus(userId: string): Promise<ConnectionStatusDto>`
- `connect(userId: string, credentials: JiraCredentialsDto): Promise<ConnectionResultDto>`
- `disconnect(userId: string): Promise<void>`
- `refreshJiraToken(userId: string): Promise<void>`
- `executeJiraRequest<T>(userId: string, endpoint: string, method: string, data?: any): Promise<T>`

### 4.2 JiraSyncService
**Responsibility**: Handle data synchronization between the app and JIRA.
**Key Methods**:
- `syncData(userId: string): Promise<SyncResultDto>`
- `getSyncStatus(userId: string): Promise<SyncStatusDto>`
- `getSyncHistory(userId: string): Promise<SyncHistoryItemDto[]>`
- `scheduleSyncJob(userId: string, schedule: SyncScheduleDto): Promise<void>`

### 4.3 JiraProjectService
**Responsibility**: Interface with JIRA project management APIs.
**Key Methods**:
- `getProjects(userId: string): Promise<JiraProjectDto[]>`
- `getProjectDetails(userId: string, projectId: string): Promise<JiraProjectDetailDto>`
- `getProjectIssues(userId: string, projectId: string, filters?: IssueFilterDto): Promise<PaginatedResponse<JiraIssueDto>>`
- `createIssue(userId: string, projectId: string, issueData: CreateIssueDto): Promise<JiraIssueDto>`
- `getProjectMembers(userId: string, projectId: string): Promise<JiraUserDto[]>`

### 4.4 JiraIssueService
**Responsibility**: Interface with JIRA issue management APIs.
**Key Methods**:
- `getIssueDetails(userId: string, issueId: string): Promise<JiraIssueDetailDto>`
- `updateIssue(userId: string, issueId: string, data: UpdateIssueDto): Promise<JiraIssueDto>`
- `addComment(userId: string, issueId: string, comment: string): Promise<JiraCommentDto>`
- `updateIssueStatus(userId: string, issueId: string, statusId: string): Promise<JiraIssueDto>`
- `assignIssue(userId: string, issueId: string, assigneeId: string): Promise<JiraIssueDto>`
- `getTransitions(userId: string, issueId: string): Promise<JiraTransitionDto[]>`
- `executeTransition(userId: string, issueId: string, transitionId: string): Promise<JiraIssueDto>`

### 4.5 JiraMetadataService
**Responsibility**: Handle JIRA metadata and field information.
**Key Methods**:
- `getFields(userId: string): Promise<JiraFieldDto[]>`
- `getFieldOptions(userId: string, fieldId: string): Promise<JiraFieldOptionDto[]>`
- `getStatuses(userId: string): Promise<JiraStatusDto[]>`
- `getPriorities(userId: string): Promise<JiraPriorityDto[]>`
- `getIssueTypes(userId: string): Promise<JiraIssueTypeDto[]>`

## 5. Reporting and Additional Services

### 5.1 ReportingService
**Responsibility**: Generate reports and analytics data.
**Key Methods**:
- `getAvailableReports(): Promise<ReportTypeDto[]>`
- `generateReport(type: string, params?: ReportParamsDto): Promise<ReportDataDto>`
- `generateCustomReport(params: CustomReportParamsDto): Promise<ReportDataDto>`
- `getTicketsByStatus(filters?: ReportFilterDto): Promise<StatusCountDto[]>`
- `getTicketsByPriority(filters?: ReportFilterDto): Promise<PriorityCountDto[]>`
- `getVelocityData(teamId?: string, sprintCount?: number): Promise<VelocityDataDto>`
- `getBurndownData(sprintId: string): Promise<BurndownDataDto>`
- `exportReport(type: string, format: string, params?: ReportParamsDto): Promise<ExportResultDto>`

### 5.2 NotificationService
**Responsibility**: Manage user notifications and alerts.
**Key Methods**:
- `getNotifications(userId: string): Promise<NotificationDto[]>`
- `markAsRead(notificationId: string): Promise<void>`
- `markAllAsRead(userId: string): Promise<void>`
- `createNotification(data: CreateNotificationDto): Promise<NotificationDto>`
- `sendPushNotification(userId: string, data: PushNotificationDto): Promise<void>`

### 5.3 SearchService
**Responsibility**: Provide global search functionality across entities.
**Key Methods**:
- `search(query: string, filters?: SearchFilterDto): Promise<SearchResultDto>`
- `searchTickets(query: string): Promise<TicketDto[]>`
- `searchProjects(query: string): Promise<ProjectDto[]>`
- `searchUsers(query: string): Promise<UserDto[]>`

### 5.4 FileService
**Responsibility**: Handle file uploads, storage, and retrieval.
**Key Methods**:
- `uploadFile(file: Express.Multer.File, metadata: FileMetadataDto): Promise<FileDto>`
- `getFile(fileId: string): Promise<FileResponseDto>`
- `deleteFile(fileId: string): Promise<void>`
- `getSignedUrl(fileId: string, expiresIn: number): Promise<SignedUrlDto>`

## 6. Util Services

### 6.1 LoggingService
**Responsibility**: Centralized logging for the application.
**Key Methods**:
- `log(level: LogLevel, message: string, context?: any): void`
- `error(message: string, trace?: string, context?: any): void`
- `warn(message: string, context?: any): void`
- `debug(message: string, context?: any): void`
- `verbose(message: string, context?: any): void`

### 6.2 ConfigService
**Responsibility**: Manage application configuration and environment variables.
**Key Methods**:
- `get(key: string): any`
- `getOrThrow(key: string): any`
- `getNumber(key: string): number`
- `getBoolean(key: string): boolean`
- `getAll(): Record<string, any>`

### 6.3 CacheService
**Responsibility**: Handle caching of frequently accessed data.
**Key Methods**:
- `get<T>(key: string): Promise<T | null>`
- `set<T>(key: string, value: T, ttl?: number): Promise<void>`
- `delete(key: string): Promise<void>`
- `clear(pattern?: string): Promise<void>`
- `wrap<T>(key: string, factory: () => Promise<T>, ttl?: number): Promise<T>`

## 7. Service Dependencies Diagram

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ AuthService     │◄────►│ UserService     │◄────►│ ConfigService   │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        ▲                        ▲                        ▲
        │                        │                        │
        ▼                        ▼                        ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ DashboardService│◄────►│ TicketService   │◄────►│ LoggingService  │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        ▲                        ▲                        ▲
        │                        │                        │
        ▼                        ▼                        ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ ProjectService  │◄────►│ JiraIssueService│◄────►│ CacheService    │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        ▲                        ▲                        ▲
        │                        │                        │
        ▼                        ▼                        ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ VoiceProcessing │◄────►│ JiraConnection  │◄────►│ FileService     │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        ▲                        ▲                        ▲
        │                        │                        │
        ▼                        ▼                        ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ OpenRouterSvc   │◄────►│ JiraSyncService │◄────►│ SearchService   │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        ▲                        ▲                        ▲
        │                        │                        │
        ▼                        ▼                        ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ VoiceHistorySvc │◄────►│ ReportingService│◄────►│ NotificationSvc │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## 8. Implementation Strategy

### 8.1 Service Implementation Priorities

1. **Core Infrastructure (Sprint 1)**
   - AuthService
   - UserService
   - ConfigService
   - LoggingService
   - CacheService
   - JiraConnectionService

2. **Basic Features (Sprint 2)**
   - TicketService
   - ProjectService
   - DashboardService
   - JiraIssueService
   - JiraProjectService
   - FileService

3. **Voice Features (Sprint 3)**
   - VoiceProcessingService
   - OpenRouterService
   - VoiceHistoryService
   - VoiceSettingsService

4. **Advanced Features (Sprint 4)**
   - ReportingService
   - JiraSyncService
   - SearchService
   - NotificationService
   - JiraMetadataService

### 8.2 Testing Strategy

Each service should have:

1. **Unit Tests**
   - Test each method in isolation
   - Mock dependencies
   - Test edge cases and error handling

2. **Integration Tests**
   - Test interaction between related services
   - Test database operations
   - Test external API integrations with mocks

3. **E2E Tests**
   - Test complete workflows
   - Test API endpoints

### 8.3 Dependency Injection Setup

Services will be registered in their respective NestJS modules:

```typescript
// auth.module.ts
@Module({
  imports: [UserModule, ConfigModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

// voice.module.ts
@Module({
  imports: [
    JiraModule,
    UserModule,
    ConfigModule,
  ],
  providers: [
    VoiceProcessingService, 
    VoiceHistoryService, 
    VoiceSettingsService,
    OpenRouterService
  ],
  exports: [
    VoiceProcessingService, 
    VoiceHistoryService, 
    VoiceSettingsService
  ],
})
export class VoiceModule {}
``` 