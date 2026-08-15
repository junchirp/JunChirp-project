'use client';

import { useToastContext } from '@/providers/MessageProvider';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { ToastMessageInterface } from '@/shared/interfaces/toast-message.interface';

export const useToast = (): {
  showToast: (msg: ToastMessageInterface | ToastMessageInterface[]) => void;
  isActive: (key: ToastKeysEnum) => boolean;
} => {
  const { showToast, isActive } = useToastContext();
  return { showToast, isActive };
};
