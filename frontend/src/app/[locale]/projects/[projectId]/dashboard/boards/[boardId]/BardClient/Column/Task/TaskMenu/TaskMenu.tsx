'use client';

import { MouseEvent, ReactElement, useRef, useState } from 'react';
import styles from './TaskMenu.module.scss';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { TaskInterface } from '@/shared/interfaces/task.interface';

interface ColumnMenuProps {
  task: TaskInterface;
  onDelete: (task: TaskInterface) => void;
  onEdit: (task: TaskInterface) => void;
}

export default function TaskMenu(props: ColumnMenuProps): ReactElement {
  const { onDelete, onEdit, task } = props;
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('task.menu');

  const toggleMenu = (event: MouseEvent): void => {
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  const closeMenu = (): void => {
    setIsOpen(false);
  };

  const deleteTask = (event: MouseEvent): void => {
    event.stopPropagation();
    onDelete(task);
    setIsOpen(false);
  };

  const editTask = (event: MouseEvent): void => {
    event.stopPropagation();
    onEdit(task);
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
    <div className={styles['task-menu']}>
      <div ref={buttonRef}>
        <button className={styles['task-menu__button']} onClick={toggleMenu}>
          <Image width={16} height={16} src="/images/dots.svg" alt="dots" />
        </button>
      </div>
      {isOpen && (
        <nav className={styles['task-menu__menu']} ref={menuRef}>
          <button className={styles['task-menu__item']} onClick={editTask}>
            {t('edit')}
          </button>
          <button className={styles['task-menu__item']} onClick={deleteTask}>
            {t('delete')}
          </button>
        </nav>
      )}
    </div>
  );
}
