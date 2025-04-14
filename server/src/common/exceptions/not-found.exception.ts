import { NotFoundException } from '@nestjs/common';

/**
 * Exception for cases where a specific entity or resource was not found.
 */
export class EntityNotFoundException extends NotFoundException {
  constructor(entityName: string, criteria?: string) {
    const message = criteria
      ? `${entityName} matching criteria [${criteria}] not found.`
      : `${entityName} not found.`;
    super(message);
  }
}
