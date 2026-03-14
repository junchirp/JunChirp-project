'use client';

import { ReactElement } from 'react';
import VerificationResultContent from '@/shared/components/VerificationResultContent/VerificationResultContent';
import Button from '@/shared/components/Button/Button';
import { useSearchParams } from 'next/navigation';
import { useResendConfirmationEmailMutation } from '@/api/authApi';
import { useToast } from '@/hooks/useToast';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useLocale, useTranslations } from 'next-intl';
import { Locale, useRouter } from '@/i18n/routing';
import { useError429Toast } from '../../../../../hooks/useError429Toast';
import { ToastKeysEnum } from '../../../../../shared/enums/toast-keys.enum';

export default function InvalidClient(): ReactElement {
  const { showToast, isActive } = useToast();
  const { showToast: showError } = useError429Toast();
  const searchParams = useSearchParams();
  const [resendEmail, { isLoading }] = useResendConfirmationEmailMutation();
  const token = searchParams.get('token') ?? '';
  const t = useTranslations('confirmationResult.invalid');
  const locale = useLocale();
  const router = useRouter();

  const onSubmit = async (): Promise<void> => {
    if (isActive('confirm email')) {
      return;
    }

    const result = await resendEmail({ token, locale: locale as Locale });

    if ('data' in result) {
      showToast({
        severity: 'success',
        summary: t('success'),
        detail: t('successDetails'),
        life: 3000,
        actionKey: 'confirm email',
      });
    } else if ('error' in result) {
      const errorData = result.error as (
        | FetchBaseQueryError
        | SerializedError
      ) & {
        status?: number;
        data: {
          retryAfter: string;
        };
      };
      const resStatus = errorData.status;
      if (resStatus === 429) {
        showError(
          errorData?.data.retryAfter ?? '',
          ToastKeysEnum.EMAIL_CONFIRMATION,
        );
      } else {
        router.replace('/verify-email/deleted');
      }
    }
  };

  return (
    <VerificationResultContent
      title={t('title')}
      titleType="error"
      content={
        <div>
          <p>
            {t.rich('description', {
              button: (chunks) => (
                <Button
                  variant="link"
                  color="green"
                  onClick={onSubmit}
                  loading={isLoading}
                >
                  {chunks}
                </Button>
              ),
            })}
          </p>
        </div>
      }
    />
  );
}
