import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Interface for paginated response data
 */
export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  links?: {
    first?: string;
    previous?: string;
    next?: string;
    last?: string;
  };
}

/**
 * Standard API response format
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

/**
 * Interceptor for transforming responses into a standard format
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  /**
   * Intercepts the response and transforms it into the standard format
   * @param context The execution context
   * @param next The call handler
   * @returns The transformed response
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const now = new Date();
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        message: 'Operation successful',
        timestamp: now.toISOString(),
        statusCode: response.statusCode,
      })),
    );
  }
}
