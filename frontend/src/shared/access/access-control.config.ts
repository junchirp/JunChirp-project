import { AccessResolverType, ModeType } from './access-control.type';

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

  discord: ({ user, url }) => {
    if (!user) {
      return `/auth/login?next=${encodeURIComponent(url)}`;
    }
    if (!user.isVerified) {
      return '/';
    }
    if (!user.discordId) {
      return '/projects';
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
    if (!user.discordId) {
      return `/projects/${projectId}`;
    }

    if (error && 'status' in error && error.status === 403) {
      return `/projects/${projectId}`;
    }

    return null;
  },
};
