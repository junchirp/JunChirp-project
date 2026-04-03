'use client';

import {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useRef,
  useState,
} from 'react';
import { Toast, ToastMessage } from 'primereact/toast';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';

export interface ToastMessageWithKey extends ToastMessage {
  actionKey: ToastKeysEnum;
}

interface ToastContextType {
  showToast: (msg: ToastMessageWithKey | ToastMessageWithKey[]) => void;
  isActive: (key: ToastKeysEnum) => boolean;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function MessageProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const toastRef = useRef<Toast>(null);

  const [activeKeys, setActiveKeys] = useState<Set<ToastKeysEnum>>(new Set());

  const showToast = (
    msg: ToastMessageWithKey | ToastMessageWithKey[],
  ): void => {
    const messages = Array.isArray(msg) ? msg : [msg];

    messages.forEach((m) => {
      const uniqueKey = m.actionKey;

      if (activeKeys.has(uniqueKey)) {
        return;
      }

      setActiveKeys((prev) => new Set(prev).add(uniqueKey));
      toastRef.current?.show(m);

      const life = m.life ?? 3000;
      setTimeout(() => {
        setActiveKeys((prev) => {
          const newSet = new Set(prev);
          newSet.delete(uniqueKey);
          return newSet;
        });
      }, life);
    });
  };

  const isActive = (key: ToastKeysEnum): boolean => {
    return activeKeys.has(key);
  };

  return (
    <ToastContext.Provider value={{ showToast, isActive }}>
      <Toast className="message-provider" ref={toastRef} position="center" />
      {children}
    </ToastContext.Provider>
  );
}

export const useToastContext = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return context;
};
