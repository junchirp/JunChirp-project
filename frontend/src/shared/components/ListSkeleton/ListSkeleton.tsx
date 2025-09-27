'use client';

import { ReactElement } from 'react';
import styles from './ListSkeleton.module.scss';

interface ListSkeletonProps {
  height: number;
  lines?: number;
}

export default function ListSkeleton({
  height,
  lines = 1,
}: ListSkeletonProps): ReactElement {
  return (
    <div
      className={styles['list-skeleton']}
      style={{ gridTemplateRows: `repeat(${lines}, 1fr)` }}
    >
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={styles['list-skeleton__item']}
          style={{ height: `${height}px` }}
        />
      ))}
    </div>
  );
}
