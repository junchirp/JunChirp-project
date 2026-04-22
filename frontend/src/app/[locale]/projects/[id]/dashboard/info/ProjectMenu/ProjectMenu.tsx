'use client';

import { ReactElement, useEffect, useRef, useState } from 'react';
import styles from './ProjectMenu.module.scss';
import Image from 'next/image';
import Settings from '@/assets/icons/settings.svg';
import Button from '@/shared/components/Button/Button';

interface ProjectMenuProps {
  projectId: string;
  isOwner: boolean;
}

export default function ProjectMenu({
  projectId,
  isOwner,
}: ProjectMenuProps): ReactElement {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLElement>(null);

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

  return (
    <div className={styles['project-menu']}>
      <div ref={buttonRef}>
        <Button
          className={styles['project-menu__button']}
          variant="secondary-frame"
          color="green"
          icon={<Settings />}
          onClick={toggleMenu}
        />
      </div>

      {isOpen && (
        <nav className={styles['project-menu__menu']} ref={menuRef}>
          {isOwner ? (
            <>
              <button className={styles['project-menu__item']}>
                <Image
                  src="/images/edit.svg"
                  alt="edit"
                  width={48}
                  height={48}
                />
                <span className={styles['project-menu__text']}>
                  Редагувати проєкт
                </span>
              </button>
              <button className={styles['project-menu__item']}>
                <Image
                  src="/images/owner.svg"
                  alt="owner"
                  width={48}
                  height={48}
                />
                <span className={styles['project-menu__text']}>
                  Передати право власності в проєкті
                </span>
              </button>
              <button className={styles['project-menu__item']}>
                <Image
                  src="/images/save.svg"
                  alt="save"
                  width={48}
                  height={48}
                />
                <span className={styles['project-menu__text']}>
                  Архівувати проєкт
                </span>
              </button>
              <button className={styles['project-menu__item']}>
                <Image
                  src="/images/trash.svg"
                  alt="trash"
                  width={48}
                  height={48}
                />
                <span className={styles['project-menu__text']}>
                  Видалити проєкт
                </span>
              </button>
            </>
          ) : (
            <button className={styles['project-menu__item']}>
              <Image
                src="/images/trash.svg"
                alt="trash"
                width={48}
                height={48}
              />
              <span className={styles['project-menu__text']}>
                Вийти з проєкту
              </span>
            </button>
          )}
        </nav>
      )}
    </div>
  );
}
