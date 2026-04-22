'use client';

import { ReactElement } from 'react';
import { DIALOG_SLOT } from '@/shared/constants/dialog-slot';
import styles from './DialogHeader.module.scss';

interface HeaderProps {
  title: string;
}

export default function DialogHeader({ title }: HeaderProps): ReactElement {
  return <h3 className={styles['dialog-header']}>{title}</h3>;
}

DialogHeader[DIALOG_SLOT] = 'header';
