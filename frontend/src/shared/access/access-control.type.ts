import { AuthInterface } from '../interfaces/auth.interface';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

export type ModeType =
  | 'no-auth'
  | 'no-verified'
  | 'verified'
  | 'discord'
  | 'member';

export interface AccessContextInterface {
  user: AuthInterface | null;
  url: string;
  projectId?: string;
  error?: FetchBaseQueryError | SerializedError;
}

export type AccessResolverType = (ctx: AccessContextInterface) => string | null;
