'use client';

import {
  createContext,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import DiscordBanner from '@/shared/components/DiscordBanner/DiscordBanner';
import { DiscordConnectOptionsInterface } from '@/shared/interfaces/discord-connect-options.interface';

interface DiscordContextType {
  openDiscordConnect: (options?: DiscordConnectOptionsInterface) => void;
}

const DEFAULT_DISCORD_OPTIONS: DiscordConnectOptionsInterface = {
  withWrapper: true,
  isCancelButton: true,
};

const DiscordContext = createContext<DiscordContextType | undefined>(undefined);

export function DiscordProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [discordOptions, setDiscordOptions] =
    useState<DiscordConnectOptionsInterface>(DEFAULT_DISCORD_OPTIONS);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const openDiscordConnect = useCallback(
    (
      options: DiscordConnectOptionsInterface = DEFAULT_DISCORD_OPTIONS,
    ): void => {
      setDiscordOptions(options);
      setIsOpen(true);
    },
    [],
  );

  const closeDiscordConnect = (): void => setIsOpen(false);

  useEffect(() => {
    if (searchParams.get('connect') !== 'discord') {
      return;
    }

    setIsOpen(true);

    const params = new URLSearchParams(searchParams.toString());
    params.delete('connect');

    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [searchParams, pathname, router]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <DiscordContext.Provider value={{ openDiscordConnect }}>
      {children}
      {isOpen && (
        <DiscordBanner
          closeBanner={closeDiscordConnect}
          isCancelButton={discordOptions.isCancelButton}
          withWrapper={discordOptions.withWrapper}
        />
      )}
    </DiscordContext.Provider>
  );
}

export const useDiscordContext = (): DiscordContextType => {
  const context = useContext(DiscordContext);
  if (!context) {
    throw new Error('useDiscord must be used within DiscordProvider');
  }
  return context;
};
