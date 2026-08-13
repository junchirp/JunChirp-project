'use client';

import {
  ForwardedRef,
  forwardRef,
  ReactElement,
  useId,
  useImperativeHandle,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import ToastMessageComponent from '@/shared/components/Toast/ToastMessage/ToastMessage';
import { ToastMessageInterface } from '@/shared/interfaces/toast-message.interface';
import { ToastItemInterface } from '@/shared/interfaces/toast-item.interface';
import styles from './Toast.module.scss';

export interface ToastInterface {
  show: (message: ToastMessageInterface) => void;
}

function ToastComponent(
  _: object,
  ref: ForwardedRef<ToastInterface>,
): ReactElement | null {
  const [messages, setMessages] = useState<ToastItemInterface[]>([]);
  const id = useId();

  useImperativeHandle(ref, () => ({
    show(message: ToastMessageInterface): void {
      setMessages((prev) => [
        ...prev,
        {
          ...message,
          id,
        },
      ]);

      const life = message.life ?? 3000;
      setTimeout(() => {
        setMessages((prev) => prev.filter((item) => item.id !== id));
      }, life);
    },
  }));

  if (messages.length === 0) {
    return null;
  }

  return createPortal(
    <div className={styles.toast} aria-live="polite" aria-atomic="true">
      {messages.map((message) => (
        <ToastMessageComponent key={message.id} message={message} />
      ))}
    </div>,
    document.body,
  );
}

const Toast = forwardRef(ToastComponent);

export default Toast;
