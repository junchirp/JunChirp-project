import {
  ToastMessageWithKey,
  useToastContext,
} from '@/providers/MessageProvider';

export const useToast = (): {
  showToast: (msg: ToastMessageWithKey | ToastMessageWithKey[]) => void;
  isActive: (key: string) => boolean;
} => {
  const { showToast, isActive } = useToastContext();
  return { showToast, isActive };
};
