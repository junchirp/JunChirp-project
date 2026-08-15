import { ToastSeverityType } from '@/shared/types/toast-severity.type';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { ReactElement } from 'react';

export interface ToastMessageInterface {
  severity: ToastSeverityType;
  summary?: string | ReactElement;
  detail?: string | ReactElement;
  life?: number;
  actionKey: ToastKeysEnum;
}
