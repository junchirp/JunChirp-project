'use client';

import { ReactElement, ReactNode } from 'react';
import { DIALOG_SLOT } from '@/shared/constants/dialog-slot';
import styles from './DialogBody.module.scss';

interface BodyProps {
  children: ReactNode;
}

export default function DialogBody({ children }: BodyProps): ReactElement {
  return <div className={styles['dialog-body']}>{children}</div>;
}

DialogBody[DIALOG_SLOT] = 'body';
