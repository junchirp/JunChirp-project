'use client';

import { ReactElement, useRef, useState } from 'react';
import styles from './ColumnMenu.module.scss';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useTranslations } from 'next-intl';
import { TaskStatusInterface } from '@/shared/interfaces/task-status.interface';
import Image from 'next/image';

interface ColumnMenuProps {
  columnsCount: number;
  currentColumn: TaskStatusInterface;
  onDelete: (id: string) => void;
  onRename: () => void;
}

export default function ColumnMenu(props: ColumnMenuProps): ReactElement {
  const { columnsCount, currentColumn, onDelete, onRename } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('boards.menu');

  const toggleMenu = (): void => setIsOpen((prev) => !prev);
  const closeMenu = (): void => setIsOpen(false);

  const deleteColumn = (): void => {
    onDelete(currentColumn.id);
    setIsOpen(false);
  };

  const renameColumn = (): void => {
    onRename();
    setIsOpen(false);
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

  return (
    <div className={styles['column-menu']}>
      <div ref={buttonRef}>
        <button className={styles['column-menu__button']} onClick={toggleMenu}>
          <Image width={16} height={16} src="/images/dots.svg" alt="dots" />
        </button>
      </div>
      {isOpen && (
        <nav className={styles['column-menu__menu']} ref={menuRef}>
          <button
            className={styles['column-menu__item']}
            onClick={renameColumn}
          >
            {t('rename')}
          </button>
          <button
            className={styles['column-menu__item']}
            disabled={columnsCount <= 1}
            onClick={deleteColumn}
          >
            {t('delete')}
          </button>
        </nav>
      )}
    </div>
  );
}
