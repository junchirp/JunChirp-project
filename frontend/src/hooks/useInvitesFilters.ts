'use client';

import { useUrlFilters, UseUrlFiltersResult } from '@/hooks/useUrlFilters';
import { InvitesFiltersInterface } from '@/shared/interfaces/invites-filters.interface';

const INVITE_FILTER_KEYS = [
  'invitesPage',
  'invitesLimit',
] as const satisfies readonly (keyof InvitesFiltersInterface)[];

const parse = (searchParams: URLSearchParams): InvitesFiltersInterface => ({
  invitesPage: Number(searchParams.get('invitesPage') ?? 1),
  invitesLimit: Number(searchParams.get('invitesLimit') ?? 10),
});

export const useInvitesFilters =
  (): UseUrlFiltersResult<InvitesFiltersInterface> => {
    return useUrlFilters<InvitesFiltersInterface>({
      keys: INVITE_FILTER_KEYS,
      parse,
    });
  };
