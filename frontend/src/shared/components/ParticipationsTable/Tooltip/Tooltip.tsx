'use client';

import { ReactElement, ReactNode } from 'react';
import styles from './Tooltip.module.scss';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
}

export default function Tooltip({
  children,
  content,
}: TooltipProps): ReactElement {
  return (
    <div className={styles.tooltip__wrapper}>
      {children}
      <div className={styles.tooltip}>{content}</div>
    </div>
  );
}
