'use client';

import { ReactElement, ReactNode, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import { SerializedError } from '@reduxjs/toolkit';
import { ProjectInterface } from '../../interfaces/project.interface';

interface UniversalAccessGuardProps {
  children: ReactNode;
  checkDataAccess?: () =>
    | {
        data?: ProjectInterface;
        error?: FetchBaseQueryError | SerializedError;
        isLoading?: boolean;
      }
    | undefined;
  loadingFallback?: ReactNode;
  requireVerified?: boolean;
}

type AuthRule =
  | { requireAuth: true; requireNoAuth?: never }
  | { requireNoAuth: true; requireAuth?: never };

type VerifiedRule =
  | { requireVerified: true; requireNoVerified?: never }
  | { requireNoVerified: true; requireVerified?: never }
  | { requireNoVerified?: never; requireVerified?: never };

type AccessRule = AuthRule &
  VerifiedRule & {
    requireDiscord?: boolean;
    requireProjectMember?: boolean;
  };

export const ACCESS_CONFIG: Record<string, AccessRule> = {
  login: {
    requireNoAuth: true,
  },

  confirmEmailInfo: {
    requireAuth: true,
    requireNoVerified: true,
  },

  requestPasswordReset: {
    requireNoAuth: true,
  },

  resetPasswordConfirmInfo: {
    requireNoAuth: true,
  },

  profile: {
    requireAuth: true,
    requireVerified: true,
  },

  users: {
    requireAuth: true,
    requireVerified: true,
  },

  projects: {
    requireAuth: true,
    requireVerified: true,
  },

  newProject: {
    requireAuth: true,
    requireVerified: true,
    requireDiscord: true,
  },

  projectPublic: {
    requireAuth: true,
    requireVerified: true,
  },

  projectCabinet: {
    requireAuth: true,
    requireVerified: true,
    requireProjectMember: true,
  },
};
