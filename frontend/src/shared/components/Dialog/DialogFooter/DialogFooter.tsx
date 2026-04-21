'use client';

import { ReactElement, ReactNode } from 'react';
import { DIALOG_SLOT } from '@/shared/constants/dialog-slot';
import styles from './DialogFooter.module.scss';

interface FooterProps {
  children: ReactNode;
}

export default function DialogFooter({ children }: FooterProps): ReactElement {
  return <div className={styles['dialog-footer']}>{children}</div>;
}

DialogFooter[DIALOG_SLOT] = 'footer';
