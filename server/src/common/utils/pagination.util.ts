import { Request } from 'express'; // Needed for generating links
import { PaginatedResponse } from '../interceptors/transform.interceptor'; // Import the interface

export interface PaginationOptions {
  page: number;
  limit: number;
  route?: string; // Base route path for link generation
}

export interface PaginationResult<T> {
  items: T[];
  totalItems: number;
}

/**
 * Creates a paginated response object conforming to the PaginatedResponse interface.
 *
 * @param items The items for the current page.
 * @param totalItems The total number of items available across all pages.
 * @param options Pagination options including page, limit, and optional route for link generation.
 * @param req Optional Express Request object to derive the base URL for links automatically.
 * @returns A PaginatedResponse object.
 */
export function createPaginatedResponse<T>(
  result: PaginationResult<T>,
  options: PaginationOptions,
  req?: Request,
): PaginatedResponse<T> {
  const { items, totalItems } = result;
  const { page, limit } = options;
  const totalPages = Math.ceil(totalItems / limit);
  const itemCount = items.length;

  const response: PaginatedResponse<T> = {
    items,
    meta: {
      totalItems,
      itemCount,
      itemsPerPage: limit,
      totalPages,
      currentPage: page,
    },
  };

  // Generate links if route is provided
  if (options.route || (req && req.originalUrl)) {
    let baseUrl = options.route;
    if (!baseUrl && req) {
      const urlParts = req.originalUrl.split('?')[0];
      baseUrl = `${req.protocol}://${req.get('host')}${urlParts}`;
    }

    if (baseUrl) {
      response.links = {
        first: `${baseUrl}?page=1&limit=${limit}`,
        previous:
          page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : undefined,
        next:
          page < totalPages
            ? `${baseUrl}?page=${page + 1}&limit=${limit}`
            : undefined,
        last: `${baseUrl}?page=${totalPages}&limit=${limit}`,
      };
      // Remove undefined links
      if (!response.links.previous) delete response.links.previous;
      if (!response.links.next) delete response.links.next;
      // Don't show last link if only one page
      if (totalPages <= 1) delete response.links.last;
    }
  }

  return response;
}
