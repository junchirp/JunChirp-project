import { AuthInterface } from '@/shared/interfaces/auth.interface';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { ProjectInterface } from '@/shared/interfaces/project.interface';

export type ModeType =
  | 'no-auth'
  | 'no-verified'
  | 'verified'
  | 'discord'
  | 'member'
  | 'no-member';

export interface AccessContextInterface {
  user: AuthInterface | null;
  url: string;
  projectId?: string;
  data?: ProjectInterface;
  error?: FetchBaseQueryError | SerializedError;
}

export type AccessResolverType = (ctx: AccessContextInterface) => string | null;
