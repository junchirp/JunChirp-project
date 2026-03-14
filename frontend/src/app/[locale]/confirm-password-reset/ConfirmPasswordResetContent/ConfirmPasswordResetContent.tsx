'use client';

import { ReactElement, useEffect } from 'react';
import styles from './ConfirmPasswordResetContent.module.scss';
import Button from '@/shared/components/Button/Button';
import {
  useGetPasswordResetTokenQuery,
  useRequestPasswordResetMutation,
} from '@/api/authApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useToast } from '@/hooks/useToast';
import { Locale, useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { ToastKeysEnum } from '../../../../shared/enums/toast-keys.enum';
import { useError429Toast } from '../../../../hooks/useError429Toast';

export default function ConfirmPasswordResetContent(): ReactElement | null {
  const [reqResetPassword, { isLoading }] = useRequestPasswordResetMutation();
  const { showToast, isActive } = useToast();
  const { showToast: showError } = useError429Toast();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('resetPasswordConfirmation');
  const tInfo: string[] = t.raw('information');
  const searchParams = useSearchParams();
  const requestId = searchParams.get('requestId') ?? '';
  const { data: token, isError } = useGetPasswordResetTokenQuery(requestId, {
    skip: !requestId,
  });

  useEffect(() => {
    if (!requestId) {
      router.replace('/request-password-reset');
    }
  }, [requestId, router]);

  useEffect(() => {
    if (isError) {
      router.replace('/request-password-reset');
    }
  }, [isError, router]);

  const handleClick = async (): Promise<void> => {
    if (isActive('confirm password reset') || !token) {
      return;
    }

    const result = await reqResetPassword({
      email: token.email,
      locale: locale as Locale,
    });

    if ('data' in result) {
      showToast({
        severity: 'success',
        summary: t('success'),
        detail: t('successDetails'),
        life: 3000,
        actionKey: 'confirm password reset',
      });
    }

    if ('error' in result) {
      const errorData = result.error as
        | ((FetchBaseQueryError | SerializedError) & {
            status: number;
            data: { attemptsCount: number; retryAfter: string };
          })
        | undefined;
      const status = errorData?.status;

      if (status === 429) {
        showError(
          errorData?.data.retryAfter ?? '',
          ToastKeysEnum.PASSWORD_RESET_CONFIRMATION,
        );
      } else {
        router.replace('/request-password-reset');
      }
    }
  };

  return (
    <div className={styles['confirm-password-reset-content']}>
      <h2 className={styles['confirm-password-reset-content__title']}>
        {t('title')}
      </h2>
      <div className={styles['confirm-password-reset-content__content']}>
        <div>
          {t.rich('firstPart', {
            email: (chunks) => (
              <span
                className={styles['confirm-password-reset-content__green-text']}
              >
                {chunks}
              </span>
            ),
            userEmail: token?.email ?? '',
          })}
        </div>
        <div>
          {t.rich('secondPart', {
            button: (chunks) => (
              <Button
                variant="link"
                color="green"
                onClick={handleClick}
                loading={isLoading}
              >
                {chunks}
              </Button>
            ),
          })}
        </div>
      </div>
      <div className={styles['confirm-password-reset-content__content']}>
        <h6 className={styles['confirm-password-reset-content__sub-title']}>
          {t('subTitle')}
        </h6>
        {tInfo.map((fragment, index) => (
          <p key={index}>{fragment}</p>
        ))}
      </div>
    </div>
  );
}
