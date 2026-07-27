'use client';

import { ReactElement } from 'react';
import styles from './DocItem.module.scss';
import { DocumentInterface } from '@/shared/interfaces/ducument.interface';
import Button from '@/shared/components/Button/Button';
import Image from 'next/image';
import Edit from '@/assets/icons/edit-2.svg';
import Trash from '@/assets/icons/trash.svg';

interface DocItemProps {
  doc: DocumentInterface;
  isOwner: boolean;
  onDelete: (item: DocumentInterface) => void;
  onEdit: (item: DocumentInterface) => void;
}

export default function DocItem(props: DocItemProps): ReactElement {
  const { doc, isOwner, onDelete, onEdit } = props;

  return (
    <div className={styles['doc-item']}>
      <div className={styles['doc-item__header']}>
        <a
          className={styles['doc-item__image-wrapper']}
          href={doc.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            className={`${styles['doc-item__image']} ${styles['doc-item__image--default']}`}
            src="/images/doc-default.svg"
            alt="doc-default"
            width={80}
            height={80}
          />
          <Image
            className={`${styles['doc-item__image']} ${styles['doc-item__image--hover']}`}
            src="/images/doc-hover.svg"
            alt="doc-hover"
            width={80}
            height={80}
          />
        </a>
        {isOwner && (
          <div className={styles['doc-item__actions']}>
            <Button
              icon={<Trash />}
              variant="tertiary"
              onClick={() => onDelete(doc)}
            />
            <Button
              icon={<Edit />}
              variant="tertiary"
              onClick={() => onEdit(doc)}
            />
          </div>
        )}
      </div>
      <a
        className={styles['doc-item__link']}
        href={doc.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {doc.documentName}
      </a>
    </div>
  );
}
