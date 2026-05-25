'use client';

import { ReactElement } from 'react';
import styles from './ListSkeleton.module.scss';

interface ListSkeletonProps {
  itemHeight: number;
  rows?: number;
  columns?: number;
  noPadding?: boolean;
}

export default function ListSkeleton({
  itemHeight,
  rows = 1,
  columns = 2,
  noPadding = false,
}: ListSkeletonProps): ReactElement {
  return (
    <div
      className={`${styles['list-skeleton']} ${noPadding ? styles['list-skeleton--no-padding'] : ''}`}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {Array.from({ length: rows * columns }).map((_, index) => (
        <div
          key={index}
          className={styles['list-skeleton__item']}
          style={{ height: `${itemHeight}px` }}
        />
      ))}
    </div>
  );
}
