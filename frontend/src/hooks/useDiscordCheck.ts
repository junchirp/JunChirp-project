'use client';

import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useCheckDiscordQuery } from '@/api/discordApi';

export const useDiscordCheck = (): {
  data: void | undefined;
  error: FetchBaseQueryError | SerializedError | undefined;
  isLoading: boolean;
} => {
  const { data, error, isLoading } = useCheckDiscordQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  return { data, error, isLoading };
};
