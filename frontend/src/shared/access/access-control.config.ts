import { AccessResolverType, ModeType } from './access-control.type';
import { isGuardError } from '@/shared/utils/isGuardError';
import { isDiscordGuardError } from '@/shared/utils/isDiscordGuardError';

export const ACCESS_RESOLVERS: Record<ModeType, AccessResolverType> = {
  'no-auth': ({ user }) => {
    if (user?.isVerified) {
      return '/';
    }

    return null;
  },

  'no-verified': ({ user }) => {
    if (!user || user.isVerified) {
      return '/';
    }

    return null;
  },

  verified: ({ user, url }) => {
    if (!user) {
      return `/auth/login?next=${encodeURIComponent(url)}`;
    }

    if (!user.isVerified) {
      return '/';
    }

    return null;
  },

  discord: ({ user, url, error }) => {
    if (!user) {
      return `/auth/login?next=${encodeURIComponent(url)}`;
    }

    if (!user.isVerified) {
      return '/';
    }

    if (isDiscordGuardError(error)) {
      return '/projects?connect=discord';
    }

    return null;
  },

  member: ({ user, url, error, projectId }) => {
    if (!user) {
      return `/auth/login?next=${encodeURIComponent(url)}`;
    }

    if (!user.isVerified) {
      return '/';
    }

    if (isDiscordGuardError(error)) {
      return `/projects/${projectId}?connect=discord`;
    }

    if (isGuardError(error)) {
      return `/projects/${projectId}`;
    }

    return null;
  },

  'no-member': ({ user, url, error, projectId }) => {
    if (!user) {
      return `/auth/login?next=${encodeURIComponent(url)}`;
    }

    if (!user.isVerified) {
      return '/';
    }

    if (isGuardError(error)) {
      return `/projects/${projectId}/dashboard`;
    }

    return null;
  },
};
