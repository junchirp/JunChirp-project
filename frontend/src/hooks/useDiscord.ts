'use client';

import { useDiscordContext } from '@/providers/DiscordProvider';
import { DiscordConnectOptionsInterface } from '@/shared/interfaces/discord-connect-options.interface';

export const useDiscord = (): ((
  options: DiscordConnectOptionsInterface,
) => void) => {
  const { openDiscordConnect } = useDiscordContext();
  return openDiscordConnect;
};
