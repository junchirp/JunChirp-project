'use client';

import { ReactElement } from 'react';
import styles from './DocsListSkeleton.module.scss';
import ListSkeleton from '@/shared/components/ListSkeleton/ListSkeleton';

export default function DocsListSkeleton(): ReactElement {
  return (
    <div className={styles['docs-list-skeleton']}>
      <div className={styles['docs-list-skeleton__header']} />
      <div className={styles['docs-list-skeleton__list']}>
        <ListSkeleton itemHeight={246} rows={7} columns={3} noPadding />
      </div>
    </div>
  );
}
