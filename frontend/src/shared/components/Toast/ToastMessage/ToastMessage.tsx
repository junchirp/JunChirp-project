'use client';

import { ReactElement } from 'react';
import styles from './ToastMessage.module.scss';
import { ToastItemInterface } from '@/shared/interfaces/toast-item.interface';

interface ToastMessageProps {
  message: ToastItemInterface;
}

export default function ToastMessage({
  message,
}: ToastMessageProps): ReactElement {
  const { severity, summary, detail } = message;
  const messageClassNames = [
    styles['toast-message'],
    styles[`toast-message--${severity}`],
  ]
    .filter(Boolean)
    .join(' ');

  const summaryClassNames = [
    styles['toast-message__summary'],
    styles[`toast-message__summary--${severity}`],
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={messageClassNames}>
      {summary && <div className={summaryClassNames}>{summary}</div>}
      {detail && (
        <div className={styles['toast-message__detail']}>{detail}</div>
      )}
    </div>
  );
}
