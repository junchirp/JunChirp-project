'use client';

import { ReactElement, useEffect, useRef, useState } from 'react';
import styles from './BurgerMenu.module.scss';
import Menu from '@/assets/icons/menu.svg';
import Close from '@/assets/icons/close.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLogout } from '../../../../hooks/useLogout';

export default function BurgerMenu(): ReactElement {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const { logout } = useLogout();

  const toggleMenu = (): void => setIsOpen((prev) => !prev);
  const closeMenu = (): void => setIsOpen(false);

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
    logout();
    closeMenu();
  };

  return (
    <div className={styles['burger-menu']}>
      <button
        onClick={toggleMenu}
        className={styles['burger-menu__button']}
        ref={buttonRef}
      >
        {isOpen ? (
          <Close className={styles['burger-menu__icon']} />
        ) : (
          <Menu className={styles['burger-menu__icon']} />
        )}
      </button>

      {isOpen && (
        <nav className={styles['burger-menu__menu']} ref={menuRef}>
          <button
            className={styles['burger-menu__menu-item']}
            onClick={() => handleRedirect('/profile')}
          >
            <Image
              src="/images/profile.svg"
              alt="profile"
              width={48}
              height={48}
            />
            <span>Мій профіль</span>
          </button>
          <button
            className={styles['burger-menu__menu-item']}
            onClick={() => handleRedirect('/projects')}
          >
            <Image
              src="/images/projects.svg"
              alt="projects"
              width={48}
              height={48}
            />
            <span>Проєкти</span>
          </button>
          <button
            className={styles['burger-menu__menu-item']}
            onClick={() => handleRedirect('/users')}
          >
            <Image src="/images/users.svg" alt="users" width={48} height={48} />
            <span>Учасники</span>
          </button>
          <button
            className={styles['burger-menu__menu-item']}
            onClick={handleLogout}
          >
            <Image src="/images/exit.svg" alt="exit" width={48} height={48} />
            <span>Вихід</span>
          </button>
        </nav>
      )}
    </div>
  );
}
