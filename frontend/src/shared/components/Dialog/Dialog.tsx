'use client';

import {
  Children,
  ComponentType,
  isValidElement,
  ReactNode,
  ReactPortal,
  useEffect,
} from 'react';
import styles from './Dialog.module.scss';
import { createPortal } from 'react-dom';
import Button from '../Button/Button';
import X from '@/assets/icons/x.svg';
import { DIALOG_SLOT } from '../../constants/dialog-slot';

type DialogSlot = 'header' | 'body' | 'footer';

type SlotComponent = ComponentType & {
  [DIALOG_SLOT]?: DialogSlot;
};

interface DialogProps {
  isOpen: boolean;
  showCloseButton?: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Dialog(props: DialogProps): ReactPortal | null {
  const { isOpen, onClose, children, showCloseButton = false } = props;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKey);
    return (): void => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return (): void => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  let header: ReactNode = null;
  let body: ReactNode = null;
  let footer: ReactNode = null;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    const slot = (child.type as SlotComponent)[DIALOG_SLOT];
    if (slot === 'header') {
      header = child;
    }
    if (slot === 'body') {
      body = child;
    }
    if (slot === 'footer') {
      footer = child;
    }
  });

  return createPortal(
    <div className={styles.dialog__wrapper}>
      <div className={styles.dialog}>
        {showCloseButton && (
          <Button
            className={styles.dialog__close}
            icon={<X />}
            variant="link"
            color="black"
            size="md"
            onClick={onClose}
          />
        )}
        <div className={styles.dialog__content}>
          {header}
          {body}
        </div>
        {footer}
      </div>
    </div>,
    document.body,
  );
}
