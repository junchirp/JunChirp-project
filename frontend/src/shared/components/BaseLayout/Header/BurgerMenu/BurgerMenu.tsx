'use client';

import { ReactElement, useEffect, useRef, useState } from 'react';
import styles from './BurgerMenu.module.scss';
import Menu from '@/assets/icons/menu.svg';
import X from '@/assets/icons/x.svg';
import Image from 'next/image';
import { usePathname, useRouter } from '@/i18n/routing';
import { useLogoutMutation } from '@/api/authApi';
import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import authSelector from '@/redux/auth/authSelector';
import DiscordBanner from '@/shared/components/DiscordBanner/DiscordBanner';

export default function BurgerMenu(): ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const [logoutMutation] = useLogoutMutation();
  const tMenu = useTranslations('burgerMenu');
  const tDiscord = useTranslations('discord');
  const user = useSelector(authSelector.selectUser);
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      const target = e.target as Node;

      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleRedirect = (path: string): void => {
    router.push(path);
    closeMenu();
  };

  const handleLogout = (): void => {
    logoutMutation(undefined);
    closeMenu();
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
              <span>{tMenu('profile')}</span>
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
              <span>{tMenu('projects')}</span>
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
              <span>{tMenu('users')}</span>
            </button>
            {user?.discordId ? (
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
                <span>{tMenu('chat')}</span>
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
                <span>{tMenu('joinCommunity')}</span>
              </button>
            )}
            <button
              className={styles['burger-menu__menu-item']}
              onClick={handleLogout}
            >
              <Image src="/images/exit.svg" alt="exit" width={48} height={48} />
              <span>{tMenu('signOut')}</span>
            </button>
          </nav>
        )}
      </div>
      {isBanner && (
        <DiscordBanner
          closeBanner={closeBanner}
          message={tDiscord('homePage')}
          isCancelButton
        />
      )}
    </>
  );
}
