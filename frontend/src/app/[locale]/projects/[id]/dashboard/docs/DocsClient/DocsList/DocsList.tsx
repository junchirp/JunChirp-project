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

const MAX_DOCS_COUNT = 20;

export default function DocsList(props: DocsListProps): ReactElement {
  const { docs, isOwner, addDoc, editDoc, deleteDoc } = props;
  const t = useTranslations('documents');

  return (
    <div className={styles['docs-list']}>
      <div className={styles['docs-list__header']}>
        <p className={styles['docs-list__text']}>{t('description')}</p>
        <p className={styles['docs-list__count']}>
          {docs.length}{' '}
          <span className={styles['docs-list__total']}>/ {MAX_DOCS_COUNT}</span>
        </p>
      </div>
      <div className={styles['docs-list__list']}>
        {isOwner && (
          <button
            className={styles['docs-list__button']}
            disabled={docs.length >= MAX_DOCS_COUNT}
            onClick={addDoc}
          >
            {docs.length < MAX_DOCS_COUNT ? (
              <Image
                src="/images/add-doc-green.svg"
                alt="add-doc"
                width={92}
                height={102}
              />
            ) : (
              <Image
                src="/images/add-doc-gray.svg"
                alt="add-doc"
                width={92}
                height={102}
              />
            )}
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
