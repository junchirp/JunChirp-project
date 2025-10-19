'use client';

import { ReactElement } from 'react';
import styles from './ProjectMenu.module.scss';
import Image from 'next/image';

interface ProjectMenuProps {
  projectId: string;
  isOwner: boolean;
}

export default function ProjectMenu({
  projectId,
  isOwner,
}: ProjectMenuProps): ReactElement {
  return (
    <nav className={styles['project-menu']}>
      {isOwner ? (
        <>
          <button className={styles['project-menu__item']}>
            <Image src="/images/edit.svg" alt="edit" width={48} height={48} />
            <span className={styles['project-menu__text']}>
              Редагувати проєкт
            </span>
          </button>
          <button className={styles['project-menu__item']}>
            <Image src="/images/owner.svg" alt="owner" width={48} height={48} />
            <span className={styles['project-menu__text']}>
              Передати право власності в проєкті
            </span>
          </button>
          <button className={styles['project-menu__item']}>
            <Image src="/images/save.svg" alt="save" width={48} height={48} />
            <span className={styles['project-menu__text']}>
              Архівувати проєкт
            </span>
          </button>
          <button className={styles['project-menu__item']}>
            <Image src="/images/trash.svg" alt="trash" width={48} height={48} />
            <span className={styles['project-menu__text']}>
              Видалити проєкт
            </span>
          </button>
        </>
      ) : (
        <button className={styles['project-menu__item']}>
          <Image src="/images/trash.svg" alt="trash" width={48} height={48} />
          <span className={styles['project-menu__text']}>
            Вийти з проєкту
          </span>
        </button>
      )}
    </nav>
  );
}
