import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VoiceCommandHistory } from '../database/entities/voice-command-history.entity';
import { UsersService } from '../users/services/users.service';
import { OpenRouterService } from '../external/openrouter.service';
import { OpenAIService } from '../external/openai.service';
import { User } from '../database/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import {
  UsageStatistics,
  VoiceModel,
  CommandInterpretation,
} from '../types/voice.types';

/**
 * Service for processing voice commands and managing voice-related functionality
 */
@Injectable()
export class VoiceService {
  private readonly logger = new Logger(VoiceService.name);

  constructor(
    @InjectRepository(VoiceCommandHistory)
    private voiceHistoryRepository: Repository<VoiceCommandHistory>,
    private usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly openRouterService: OpenRouterService,
    private readonly openAIService: OpenAIService,
  ) {}

  /**
   * Process a voice command from audio data or text transcript
   * @param userId The ID of the user issuing the command
   * @param type 'audio' or 'text'
   * @param content Base64 audio data or text transcript
   * @param format Audio format (if applicable)
   * @param context Additional context for processing
   */
  async processVoiceCommand(
    userId: string,
    type: 'audio' | 'text',
    content: string,
    format?: string,
    context?: Record<string, any>,
  ) {
    this.logger.log(`Processing ${type} voice command for user ${userId}`);

    const startTime = Date.now();
    let transcript = '';
    let actionTaken = null;
    let response = null;
    let intent = null;
    let entities = null;
    let errorMessage = null;
    let status = 'processing';

    try {
      // Create history entry
      const historyEntry = this.voiceHistoryRepository.create({
        userId,
        transcript: type === 'text' ? content : '[Processing audio...]',
        status,
      });

      await this.voiceHistoryRepository.save(historyEntry);

      // If audio, transcribe first
      if (type === 'audio') {
        transcript = await this.transcribeAudio(content, format || 'webm');
        historyEntry.transcript = transcript;
        await this.voiceHistoryRepository.save(historyEntry);
      } else {
        transcript = content;
      }

      // Interpret the command to get intent and entities
      const interpretation = await this.openRouterService.interpret(
        transcript,
        context,
      );
      intent = interpretation.intent;
      entities = interpretation.entities;

      // Execute the command based on intent
      const result = await this.executeCommand(
        userId,
        intent,
        entities,
        context,
      );
      actionTaken = result.action;
      response = result.response;
      status = 'successful';
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Error processing voice command: ${err.message}`,
        err.stack,
      );
      status = 'failed';
      errorMessage = err.message;
    }

    // Update the history entry with final results
    const processingTime = (Date.now() - startTime) / 1000;

    try {
      const historyEntry = await this.voiceHistoryRepository.findOne({
        where: { userId, transcript },
        order: { createdAt: 'DESC' },
      });

      if (historyEntry) {
        historyEntry.intent = intent || '';
        historyEntry.entities = entities;
        historyEntry.status = status;
        historyEntry.errorMessage = errorMessage ?? '';
        historyEntry.response = response as any;
        historyEntry.actionTaken = actionTaken as any;
        historyEntry.processingTime = processingTime;

        await this.voiceHistoryRepository.save(historyEntry);
      }
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`Error updating voice command history: ${err.message}`);
    }

    return {
      success: status === 'successful',
      commandId: null, // Add the ID from historyEntry
      transcript,
      intent,
      entities,
      action: actionTaken,
      response,
      error: errorMessage,
    };
  }

  /**
   * Execute a command based on intent and entities
   * @param userId The ID of the user issuing the command
   * @param intent The intent of the command
   * @param entities Entities extracted from the command
   * @param context Additional context
   */
  private async executeCommand(
    userId: string,
    intent: string,
    entities: any,
    _context?: Record<string, any>,
  ) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    switch (intent) {
      case 'create_ticket':
        return this.createTicket(user, entities);
      case 'find_tickets':
        return this.findTickets(user, entities);
      case 'update_ticket':
        return this.updateTicket(user, entities);
      case 'get_project_info':
        return this.getProjectInfo(user, entities);
      default:
        throw new Error(`Unknown intent: ${intent}`);
    }
  }

  /**
   * Create a ticket based on voice command
   */
  private async createTicket(user: User, entities: any) {
    await this.validateUserPermissions(user);
    return {
      action: {
        type: 'create_ticket',
        parameters: entities,
      },
      response: {
        message: 'Ticket created successfully',
        ticketId: 'DEMO-123',
      },
    };
  }

  /**
   * Find tickets based on voice command
   */
  private findTickets(user: User, entities: any) {
    // This would integrate with the JIRA service
    return {
      action: {
        type: 'find_tickets',
        parameters: entities,
      },
      response: {
        message: 'Found tickets matching your criteria',
        tickets: [
          // Sample response data
          { id: 'DEMO-123', title: 'Sample ticket', status: 'Open' },
        ],
      },
    };
  }

  /**
   * Update a ticket based on voice command
   */
  private updateTicket(user: User, entities: any) {
    // This would integrate with the JIRA service
    return {
      action: {
        type: 'update_ticket',
        parameters: entities,
      },
      response: {
        message: 'Ticket updated successfully',
        ticketId: entities.ticketId,
      },
    };
  }

  /**
   * Get project information based on voice command
   */
  private async getProjectInfo(user: User, entities: any) {
    await this.validateUserPermissions(user);
    return {
      action: {
        type: 'get_project_info',
        parameters: entities,
      },
      response: {
        message: 'Retrieved project information',
        project: {
          id: 'DEMO',
          name: 'Demo Project',
          description: 'A project for demonstration purposes',
        },
      },
    };
  }

  /**
   * Get available voice commands
   * @param category Optional category filter
   * @param search Optional search term
   */
  async getAvailableCommands(category?: string, search?: string) {
    await this.validateConfiguration();
    const commands = [
      {
        category: 'tickets',
        commands: [
          {
            name: 'Create Ticket',
            examples: [
              'Create a new ticket for login issue',
              'Open bug for homepage crash',
            ],
            parameters: [
              { name: 'title', required: true },
              {
                name: 'type',
                required: false,
                options: ['bug', 'task', 'story'],
              },
              {
                name: 'priority',
                required: false,
                options: ['low', 'medium', 'high'],
              },
            ],
          },
          {
            name: 'Find Tickets',
            examples: ['Show my open tickets', 'Find all high priority bugs'],
            parameters: [
              {
                name: 'status',
                required: false,
                options: ['open', 'in progress', 'closed'],
              },
              { name: 'assignee', required: false },
              { name: 'priority', required: false },
            ],
          },
        ],
      },
      {
        category: 'projects',
        commands: [
          {
            name: 'Project Info',
            examples: [
              'Tell me about the Marketing project',
              'Show project details for API development',
            ],
            parameters: [{ name: 'projectName', required: true }],
          },
        ],
      },
    ];

    // Filter by category if specified
    let filteredCommands = commands;
    if (category) {
      filteredCommands = commands.filter(
        (c) => c.category.toLowerCase() === category.toLowerCase(),
      );
    }

    // Filter by search term if specified
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCommands = filteredCommands
        .map((categoryGroup) => {
          return {
            ...categoryGroup,
            commands: categoryGroup.commands.filter(
              (cmd) =>
                cmd.name.toLowerCase().includes(searchLower) ||
                cmd.examples.some((ex) =>
                  ex.toLowerCase().includes(searchLower),
                ),
            ),
          };
        })
        .filter((categoryGroup) => categoryGroup.commands.length > 0);
    }

    return filteredCommands;
  }

  /**
   * Get command suggestions based on context
   * @param context Current user context
   */
  async getCommandSuggestions(context: Record<string, any>) {
    await this.validateContext(context);
    // Based on context (e.g., current page, recent actions), suggest relevant commands
    const suggestions = [
      {
        command: 'Create ticket for this project',
        context: {
          currentProject: context.projectId,
        },
      },
      {
        command: 'Show my assigned tickets',
        context: {
          ticketView: true,
        },
      },
    ];

    return suggestions.filter((s) => {
      // Filter suggestions based on context relevance
      if (s.context.currentProject && context.projectId) {
        return true;
      }
      if (s.context.ticketView && context.page === 'tickets') {
        return true;
      }
      return false;
    });
  }

  /**
   * Get voice command history for a user
   * @param userId User ID
   * @param options Filtering and pagination options
   */
  async getCommandHistory(
    userId: string,
    options: {
      page?: number;
      limit?: number;
      startDate?: Date;
      endDate?: Date;
      status?: string;
      intent?: string;
    },
  ) {
    const {
      page = 1,
      limit = 10,
      startDate,
      endDate,
      status,
      intent,
    } = options;

    // Build query with filters
    const query = this.voiceHistoryRepository
      .createQueryBuilder('history')
      .where('history.userId = :userId', { userId })
      .orderBy('history.createdAt', 'DESC')
      .take(limit)
      .skip((page - 1) * limit);

    if (startDate) {
      query.andWhere('history.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('history.createdAt <= :endDate', { endDate });
    }

    if (status) {
      query.andWhere('history.status = :status', { status });
    }

    if (intent) {
      query.andWhere('history.intent = :intent', { intent });
    }

    // Get results and count
    const [items, total] = await Promise.all([
      query.getMany(),
      query.getCount(),
    ]);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Delete a specific voice command history entry
   * @param userId User ID
   * @param historyId History entry ID
   */
  async deleteCommandHistory(userId: string, historyId: string) {
    const historyEntry = await this.voiceHistoryRepository.findOne({
      where: { id: historyId, userId },
    });

    if (!historyEntry) {
      return { success: false, message: 'History entry not found' };
    }

    await this.voiceHistoryRepository.remove(historyEntry);
    return { success: true };
  }

  /**
   * Clear all voice command history for a user
   * @param userId User ID
   */
  async clearCommandHistory(userId: string) {
    await this.voiceHistoryRepository.delete({ userId });
    return { success: true };
  }

  private handleError(error: unknown): never {
    if (error instanceof Error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    throw new HttpException(
      'An unknown error occurred',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  /**
   * Transcribe audio data to text
   * @param audioData Base64 encoded audio data
   * @param format Audio format (e.g., 'webm', 'wav')
   */
  async transcribeAudio(audioData: string, format: string): Promise<string> {
    this.logger.debug(`Starting audio transcription. Format: ${format}`);
    this.logger.debug(`Audio data size: ${(audioData.length * 3) / 4} bytes`);

    try {
      await this.validateConfiguration();
      this.logger.debug('Configuration validated successfully');

      this.logger.debug('Starting Whisper transcription via OpenAI');
      const startTime = Date.now();
      const transcript = await this.openAIService.transcribe(audioData, format);
      const duration = Date.now() - startTime;

      this.logger.debug(`Transcription completed in ${duration}ms`);
      this.logger.debug(`Transcript length: ${transcript.length} characters`);

      if (!transcript) {
        throw new Error('Received empty transcript from Whisper');
      }

      return transcript;
    } catch (error: unknown) {
      this.logger.error(
        'Error in transcribeAudio:',
        error instanceof Error ? error.stack : 'Unknown error',
      );
      if (error instanceof Error) {
        this.logger.error(`Error message: ${error.message}`);
        throw error;
      }
      throw new Error('Failed to transcribe audio');
    }
  }

  async getAvailableModels(): Promise<VoiceModel[]> {
    await this.validateConfiguration();
    return [
      {
        transcription: [],
        interpretation: [],
        textToSpeech: [],
      },
    ];
  }

  async getUsageStatistics(): Promise<UsageStatistics> {
    try {
      const stats = await this.openRouterService.getUsageStatistics();
      return {
        totalRequests: stats.requests?.total || 0,
        audioProcessed: stats.requests?.audio || 0,
        commandsExecuted: stats.requests?.commands || 0,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(
        'Error fetching usage statistics',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async interpretCommand(_command: string): Promise<CommandInterpretation> {
    await this.validateConfiguration();
    return {
      intent: '',
      confidence: 0,
      entities: {},
    };
  }

  private async validateConfiguration(): Promise<void> {
    // Add actual validation logic
    await Promise.resolve();
  }

  private async validateContext(_context: Record<string, any>): Promise<void> {
    await Promise.resolve();
  }

  private async validateUserPermissions(_user: User): Promise<void> {
    await Promise.resolve();
  }
}
