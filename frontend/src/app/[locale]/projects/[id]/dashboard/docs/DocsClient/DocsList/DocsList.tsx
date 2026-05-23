'use client';

import { ReactElement } from 'react';
import styles from './DocsList.module.scss';
import { DocumentInterface } from '@/shared/interfaces/ducument.interface';
import Image from 'next/image';
import DocItem from './DocItem/DocItem';
import { useTranslations } from 'next-intl';

interface DocsListProps {
  docs: DocumentInterface[];
  isOwner: boolean;
  addDoc: () => void;
  editDoc: (doc: DocumentInterface) => void;
  deleteDoc: (doc: DocumentInterface) => void;
}

export default function DocsList(props: DocsListProps): ReactElement {
  const { docs, isOwner, addDoc, editDoc, deleteDoc } = props;
  const t = useTranslations('documents');

  return (
    <div className={styles['docs-list']}>
      <div className={styles['docs-list__header']}>
        <p className={styles['docs-list__text']}>{t('description')}</p>
        <p className={styles['docs-list__count']}>
          {docs.length} <span className={styles['docs-list__total']}>/ 20</span>
        </p>
      </div>
      <div className={styles['docs-list__list']}>
        {isOwner && (
          <button className={styles['docs-list__button']} onClick={addDoc}>
            <Image
              src="/images/add-doc.svg"
              alt="add-doc"
              width={92}
              height={102}
            />
            <span className={styles['docs-list__button-text']}>
              {t('button')}
            </span>
          </button>
        )}
        {docs.map((doc) => (
          <DocItem
            key={doc.id}
            doc={doc}
            isOwner={isOwner}
            onDelete={deleteDoc}
            onEdit={editDoc}
          />
        ))}
      </div>
    </div>
  );
}
