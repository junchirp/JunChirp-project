'use client';

import { ReactElement, useRef, useState } from 'react';
import styles from './BurgerMenu.module.scss';
import Menu from '@/assets/icons/menu.svg';
import X from '@/assets/icons/x.svg';
import Image from 'next/image';
import { usePathname, useRouter } from '@/i18n/routing';
import { useLazyCheckDiscordQuery, useLogoutMutation } from '@/api/authApi';
import { useTranslations } from 'next-intl';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useDiscord } from '@/hooks/useDiscord';
import { isDiscordGuardError } from '@/shared/utils/isDiscordGuardError';
import Spinner from '@/shared/components/Spinner/Spinner';

export default function BurgerMenu(): ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const [logoutMutation] = useLogoutMutation();
  const openDiscordConnect = useDiscord();
  const [checkDiscord] = useLazyCheckDiscordQuery();
  const [discordStatus, setDiscordStatus] = useState<
    'unknown' | 'connected' | 'not-connected'
  >('unknown');
  const [isCheckingDiscord, setIsCheckingDiscord] = useState(false);
  const t = useTranslations('burgerMenu');

  const closeMenu = (): void => setIsOpen(false);
  const toggleMenu = async (): Promise<void> => {
    if (isOpen) {
      closeMenu();
      return;
    }

    setIsCheckingDiscord(true);

    try {
      await checkDiscord().unwrap();
      setDiscordStatus('connected');
    } catch (error) {
      if (isDiscordGuardError(error)) {
        setDiscordStatus('not-connected');
      }
    } finally {
      setIsCheckingDiscord(false);
      setIsOpen(true);
    }
  };

  const isActive = (path: string): boolean => {
    return pathname === path;
  };

  const openDiscordChat = (): void => {
    window.open(
      'https://discord.com/channels/1362056776119488755/1362056776744435947',
      '_blank',
    );
  };

  useClickOutside({
    isOpen,
    onOutside: closeMenu,
    isOutside: (e) => {
      const target = e.target as Node;
      return (
        !!menuRef.current &&
        !menuRef.current.contains(target) &&
        !!buttonRef.current &&
        !buttonRef.current.contains(target)
      );
    },
  });

  const handleRedirect = (path: string): void => {
    router.push(path);
    closeMenu();
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await logoutMutation().unwrap();
    } finally {
      closeMenu();
    }
  };

  return (
    <div className={styles['burger-menu']}>
      <button
        onClick={toggleMenu}
        className={styles['burger-menu__button']}
        ref={buttonRef}
      >
        {isCheckingDiscord ? (
          <Spinner size={40} />
        ) : isOpen ? (
          <X className={styles['burger-menu__icon']} />
        ) : (
          <Menu className={styles['burger-menu__icon']} />
        )}
      </button>

      {isOpen && (
        <nav className={styles['burger-menu__menu']} ref={menuRef}>
          <button
            className={`
                  ${styles['burger-menu__menu-item']}
                  ${isActive('/profile') && styles['burger-menu__menu-item--active']}
                `}
            onClick={() => handleRedirect('/profile')}
          >
            <Image
              src="/images/profile.svg"
              alt="profile"
              width={48}
              height={48}
            />
            <span>{t('profile')}</span>
          </button>
          <button
            className={`${styles['burger-menu__menu-item']} ${isActive('/projects') && styles['burger-menu__menu-item--active']}`}
            onClick={() => handleRedirect('/projects')}
          >
            <Image
              src="/images/projects.svg"
              alt="projects"
              width={48}
              height={48}
            />
            <span>{t('projects')}</span>
          </button>
          <button
            className={`${styles['burger-menu__menu-item']} ${isActive('/users') && styles['burger-menu__menu-item--active']}`}
            onClick={() => handleRedirect('/users')}
          >
            <Image src="/images/users.svg" alt="users" width={48} height={48} />
            <span>{t('users')}</span>
          </button>
          {discordStatus === 'connected' ? (
            <button
              className={styles['burger-menu__menu-item']}
              onClick={openDiscordChat}
            >
              <Image src="/images/chat.svg" alt="chat" width={48} height={48} />
              <span>{t('chat')}</span>
            </button>
          ) : (
            <button
              className={styles['burger-menu__menu-item']}
              onClick={() =>
                openDiscordConnect({
                  withWrapper: false,
                  isCancelButton: true,
                })
              }
            >
              <Image src="/images/chat.svg" alt="chat" width={48} height={48} />
              <span>{t('joinCommunity')}</span>
            </button>
          )}
          <button
            className={styles['burger-menu__menu-item']}
            onClick={handleLogout}
          >
            <Image src="/images/exit.svg" alt="exit" width={48} height={48} />
            <span>{t('signOut')}</span>
          </button>
        </nav>
      )}
    </div>
  );
}
