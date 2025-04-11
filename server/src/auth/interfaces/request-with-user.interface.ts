import { Request } from 'express';
import { JwtPayload } from './jwt-payload.interface';

/**
 * Extended Express Request interface that includes user data
 */
export interface RequestWithUser extends Request {
  user: JwtPayload;
}
