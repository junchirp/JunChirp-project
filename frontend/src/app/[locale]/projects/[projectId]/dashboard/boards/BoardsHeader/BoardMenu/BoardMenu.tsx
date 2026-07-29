'use client';

import { ReactElement, useRef, useState } from 'react';
import styles from './BoardMenu.module.scss';
import { useClickOutside } from '@/hooks/useClickOutside';
import { BoardInterface } from '@/shared/interfaces/board.interface';
import Button from '@/shared/components/Button/Button';
import Dots from '@/assets/icons/more-horizontal.svg';
import { useTranslations } from 'next-intl';

interface BoardMenuProps {
  boardsCount: number;
  currentBoard: BoardInterface;
  onDuplicate: () => void;
  onDelete: (id: string) => void;
  onRename: () => void;
}

export default function BoardMenu(props: BoardMenuProps): ReactElement {
  const { boardsCount, currentBoard, onDuplicate, onDelete, onRename } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('boards.menu');

  const toggleMenu = (): void => setIsOpen((prev) => !prev);
  const closeMenu = (): void => setIsOpen(false);

  const deleteBoard = (): void => {
    setIsOpen(false);
    onDelete(currentBoard.id);
  };

  const duplicateBoard = (): void => {
    setIsOpen(false);
    onDuplicate();
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
    <div className={styles['board-menu']}>
      <div ref={buttonRef}>
        <Button
          className={styles['board-menu__button']}
          variant="secondary-frame"
          color="green"
          icon={<Dots />}
          onClick={toggleMenu}
        />
      </div>
      {isOpen && (
        <nav className={styles['board-menu__menu']} ref={menuRef}>
          <button className={styles['board-menu__item']} onClick={onRename}>
            {t('rename')}
          </button>
          <button
            className={styles['board-menu__item']}
            disabled={boardsCount >= 5}
            onClick={duplicateBoard}
          >
            {t('duplicate')}
          </button>
          <button
            className={styles['board-menu__item']}
            disabled={boardsCount <= 1}
            onClick={deleteBoard}
          >
            {t('delete')}
          </button>
        </nav>
      )}
    </div>
  );
}
