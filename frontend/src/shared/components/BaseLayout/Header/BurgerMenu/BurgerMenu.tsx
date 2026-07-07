'use client';

import { ReactElement, useRef, useState } from 'react';
import styles from './BurgerMenu.module.scss';
import Menu from '@/assets/icons/menu.svg';
import X from '@/assets/icons/x.svg';
import Image from 'next/image';
import { usePathname, useRouter } from '@/i18n/routing';
import { useLogoutMutation } from '@/api/authApi';
import { useTranslations } from 'next-intl';
import DiscordBanner from '@/shared/components/DiscordBanner/DiscordBanner';
import { useClickOutside } from '@/hooks/useClickOutside';

interface BurgerMenuProps {
  isDiscord: boolean;
}

export default function BurgerMenu({
  isDiscord,
}: BurgerMenuProps): ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const [logoutMutation] = useLogoutMutation();
  const t = useTranslations('burgerMenu');
  const [isBanner, setBanner] = useState(false);

  const toggleMenu = (): void => setIsOpen((prev) => !prev);
  const closeMenu = (): void => setIsOpen(false);

  const isActive = (path: string): boolean => {
    return pathname === path;
  };

  const closeBanner = (): void => setBanner(false);
  const openBanner = (): void => setBanner(true);
  const openDiscordChat = (): void => {
    window.open('https://discord.gg/x2rdtS2Vbz', '_blank');
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
    <>
      <div className={styles['burger-menu']}>
        <button
          onClick={toggleMenu}
          className={styles['burger-menu__button']}
          ref={buttonRef}
        >
          {isOpen ? (
            <X className={styles['burger-menu__icon']} />
          ) : (
            <Menu className={styles['burger-menu__icon']} />
          )}
        </button>

        {isOpen && (
          <nav className={styles['burger-menu__menu']} ref={menuRef}>
            <button
              className={`${styles['burger-menu__menu-item']} ${isActive('/profile') && styles['burger-menu__menu-item--active']}`}
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
              <Image
                src="/images/users.svg"
                alt="users"
                width={48}
                height={48}
              />
              <span>{t('users')}</span>
            </button>
            {isDiscord ? (
              <button
                className={styles['burger-menu__menu-item']}
                onClick={openDiscordChat}
              >
                <Image
                  src="/images/chat.svg"
                  alt="chat"
                  width={48}
                  height={48}
                />
                <span>{t('chat')}</span>
              </button>
            ) : (
              <button
                className={styles['burger-menu__menu-item']}
                onClick={openBanner}
              >
                <Image
                  src="/images/chat.svg"
                  alt="chat"
                  width={48}
                  height={48}
                />
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
      {isBanner && <DiscordBanner closeBanner={closeBanner} isCancelButton />}
    </>
  );
}
