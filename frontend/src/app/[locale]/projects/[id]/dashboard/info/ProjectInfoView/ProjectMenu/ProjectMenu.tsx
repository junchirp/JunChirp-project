'use client';

import { ReactElement, useRef, useState } from 'react';
import styles from './ProjectMenu.module.scss';
import Image from 'next/image';
import Settings from '@/assets/icons/settings.svg';
import Button from '@/shared/components/Button/Button';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

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
  const router = useRouter();
  const t = useTranslations('projectMenu');

  const toggleMenu = (): void => setIsOpen((prev) => !prev);
  const closeMenu = (): void => setIsOpen(false);

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

  const handleEdit = (): void => {
    router.push(`/projects/${projectId}/dashboard/info?mode=edit`);
  };

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
              <button
                className={styles['project-menu__item']}
                onClick={handleEdit}
              >
                <Image
                  src="/images/edit.svg"
                  alt="edit"
                  width={48}
                  height={48}
                />
                <span className={styles['project-menu__text']}>
                  {t('edit')}
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
                  {t('ownership')}
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
                  {t('complete')}
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
                  {t('delete')}
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
              <span className={styles['project-menu__text']}>{t('exit')}</span>
            </button>
          )}
        </nav>
      )}
    </div>
  );
}
