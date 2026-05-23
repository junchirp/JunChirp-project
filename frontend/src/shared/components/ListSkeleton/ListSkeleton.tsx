'use client';

import { ReactElement } from 'react';
import styles from './ListSkeleton.module.scss';

interface ListSkeletonProps {
  height: number;
  rows?: number;
  columns?: number;
  noPadding?: boolean;
}

export default function ListSkeleton({
  height,
  rows = 1,
  columns = 2,
  noPadding = false,
}: ListSkeletonProps): ReactElement {
  return (
    <div
      className={styles['list-skeleton']}
      style={{
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        padding: noPadding ? '0' : '40px',
      }}
    >
      {Array.from({ length: rows * columns }).map((_, index) => (
        <div
          key={index}
          className={styles['list-skeleton__item']}
          style={{ height: `${height}px` }}
        />
      ))}
    </div>
  );
}
