export const VALID_TEAM_TABS = [
  'all',
  'members',
  'requests',
  'invitations',
  'vacancies',
] as const;

export type TeamTabType = (typeof VALID_TEAM_TABS)[number];

export const VALID_TEAM_VIEWS = ['flat', 'grouped'] as const;

export type TeamViewType = (typeof VALID_TEAM_VIEWS)[number];

export interface TeamCtxInterface {
  isOwner: boolean;
  members: number;
  requests: number;
  invitations: number;
  vacancies: number;
}

export interface TeamTabInterface {
  key: TeamTabType;
  count: number;
  disabled: boolean;
  active: boolean;
}

export type TabStateType = 'hidden' | 'disabled' | 'enabled';

export interface TeamTabConfigInterface {
  getState: (ctx: TeamCtxInterface) => TabStateType;
  fallback: TeamTabType;
  getCount: (ctx: TeamCtxInterface) => number;
}

export const TEAM_TABS: Record<TeamTabType, TeamTabConfigInterface> = {
  all: {
    getState: () => 'enabled',
    getCount: (c) =>
      c.isOwner
        ? c.members + c.requests + c.invitations + c.vacancies
        : c.members + c.vacancies,
    fallback: 'all',
  },

  members: {
    getState: () => 'enabled',
    getCount: (c) => c.members,
    fallback: 'members',
  },

  requests: {
    getState: (c) =>
      !c.isOwner ? 'hidden' : c.requests === 0 ? 'disabled' : 'enabled',
    getCount: (c) => c.requests,
    fallback: 'all',
  },

  invitations: {
    getState: (c) =>
      !c.isOwner ? 'hidden' : c.invitations === 0 ? 'disabled' : 'enabled',
    getCount: (c) => c.invitations,
    fallback: 'all',
  },

  vacancies: {
    getState: (c) => (c.vacancies === 0 && !c.isOwner ? 'disabled' : 'enabled'),
    getCount: (c) => c.vacancies,
    fallback: 'vacancies',
  },
};
