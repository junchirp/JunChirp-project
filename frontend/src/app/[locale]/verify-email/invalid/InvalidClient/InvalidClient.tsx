'use client';

import { ReactElement } from 'react';
import VerificationResultContent from '@/shared/components/VerificationResultContent/VerificationResultContent';
import Button from '@/shared/components/Button/Button';
import { useSearchParams } from 'next/navigation';
import { useSendConfirmationEmailMutation } from '@/api/authApi';
import { useToast } from '@/hooks/useToast';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useLocale, useTranslations } from 'next-intl';
import { Locale } from '@/i18n/routing';

export default function InvalidClient(): ReactElement {
  const { showToast, isActive } = useToast();
  const searchParams = useSearchParams();
  const [sendEmail, { isLoading }] = useSendConfirmationEmailMutation();
  const email = searchParams.get('email') ?? '';
  const t = useTranslations('confirmationResult.invalid');
  const locale = useLocale();

  const onSubmit = async (): Promise<void> => {
    if (isActive('confirm email')) {
      return;
    }

    const result = await sendEmail({ email, locale: locale as Locale });

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
      };
      const resStatus = errorData.status;
      if (resStatus === 429) {
        showToast({
          severity: 'error',
          summary: t('error429'),
          detail: t('error429Details'),
          life: 3000,
          actionKey: 'confirm email',
        });
      } else if (resStatus === 400) {
        showToast({
          severity: 'error',
          summary: t('error400'),
          detail: t('error400Details'),
          life: 3000,
          actionKey: 'confirm email',
        });
      } else {
        showToast({
          severity: 'error',
          summary: t('error'),
          detail: t('errorDetails'),
          life: 3000,
          actionKey: 'confirm email',
        });
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
