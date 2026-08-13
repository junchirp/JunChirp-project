import { ToastSeverityType } from '@/shared/types/toast-severity.type';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';

export interface ToastMessageInterface {
  severity: ToastSeverityType;
  summary?: string;
  detail?: string;
  life?: number;
  actionKey: ToastKeysEnum;
}
