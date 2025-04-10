import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard that enforces local authentication with username/password
 *
 * @class LocalAuthGuard
 * @extends {AuthGuard('local')}
 * Validates username and password credentials
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
