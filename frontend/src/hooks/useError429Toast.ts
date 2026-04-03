'use client';

import { useToast } from './useToast';
import { useTranslations } from 'next-intl';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';

type Toast429KeysType =
  | ToastKeysEnum.LOGIN
  | ToastKeysEnum.EMAIL_CONFIRMATION
  | ToastKeysEnum.PASSWORD_RESET_CONFIRMATION;

const TOAST_CONFIG: Record<
  Toast429KeysType,
  { summaryKey: string; detailKey: string | Record<number, string> }
> = {
  [ToastKeysEnum.LOGIN]: {
    summaryKey: 'error',
    detailKey: {
      5: 'login.errorDetails5',
      10: 'login.errorDetails10',
      15: 'login.errorDetails15',
    },
  },
  [ToastKeysEnum.EMAIL_CONFIRMATION]: {
    summaryKey: 'confirmEmail.error',
    detailKey: 'confirmEmail.errorDetails',
  },
  [ToastKeysEnum.PASSWORD_RESET_CONFIRMATION]: {
    summaryKey: 'resetPassword.error',
    detailKey: 'resetPassword.errorDetails',
  },
};

function getMessageKey(key: Toast429KeysType, attempts?: 5 | 10 | 15): string {
  return attempts
    ? TOAST_CONFIG[key].detailKey[attempts]
    : (TOAST_CONFIG[key].detailKey as string);
}

export const useError429Toast = (): {
  showToast: (
    retryAfter: string | Date,
    actionKey: Toast429KeysType,
    attemptsCount?: 5 | 10 | 15,
  ) => void;
  isActive: (key: Toast429KeysType) => boolean;
} => {
  const { showToast, isActive } = useToast();
  const t = useTranslations('error429Toast');

  const show = (
    retryAfter: string | Date,
    actionKey: Toast429KeysType,
    attemptsCount?: 5 | 10 | 15,
  ): void => {
    const now = new Date();
    const retryDate = retryAfter ? new Date(retryAfter) : now;
    const totalMinutes = Math.ceil(
      (retryDate.getTime() - now.getTime()) / (1000 * 60),
    );
    const hours = Math.trunc(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let timeStr: string;
    if (hours > 0 && minutes > 0) {
      timeStr = `${t('time.hours', { count: hours })} ${t('time.minutes', { count: minutes })}`;
    } else if (hours > 0) {
      timeStr = t('time.hours', { count: hours });
    } else {
      timeStr = t('time.minutes', { count: minutes });
    }

    showToast({
      severity: 'error',
      summary: t(TOAST_CONFIG[actionKey].summaryKey),
      detail: t(getMessageKey(actionKey, attemptsCount), { time: timeStr }),
      life: actionKey === ToastKeysEnum.LOGIN ? 10000 : 3000,
      actionKey: actionKey,
    });
  };

  return { showToast: show, isActive };
};
