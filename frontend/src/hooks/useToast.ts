import {
  ToastMessageWithKey,
  useToastContext,
} from '@/providers/MessageProvider';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';

export const useToast = (): {
  showToast: (msg: ToastMessageWithKey | ToastMessageWithKey[]) => void;
  isActive: (key: ToastKeysEnum) => boolean;
} => {
  const { showToast, isActive } = useToastContext();
  return { showToast, isActive };
};
