'use client';

import React, { ReactElement, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './RequestPasswordResetForm.module.scss';
import Input from '@/shared/components/Input/Input';
import Button from '@/shared/components/Button/Button';
import { useRequestPasswordResetMutation } from '@/api/authApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useError429Toast } from '@/hooks/useError429Toast';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { useShortLocale } from '@/hooks/useShortLocale';
import { useToast } from '@/hooks/useToast';
import { useSupport } from '@/hooks/useSupport';

interface FormData {
  email: string;
}

export default function RequestPasswordResetForm(): ReactElement {
  const tForms = useTranslations('forms');
  const tButtons = useTranslations('buttons');
  const { register, handleSubmit } = useForm<FormData>({
    mode: 'onChange',
  });
  const [reqResetPassword, { isLoading }] = useRequestPasswordResetMutation();
  const { showToast: show429Toast } = useError429Toast();
  const { showToast, isActive } = useToast();
  const support = useSupport();
  const router = useRouter();
  const locale = useShortLocale();
  const [isError, setError] = useState(false);

  const onSubmit = async (data: FormData): Promise<void> => {
    if (isActive(ToastKeysEnum.PASSWORD_RESET_CONFIRMATION)) {
      return;
    }

    setError(false);
    const trimmedData = {
      email: data.email.trim(),
      locale,
    };

    try {
      const result = await reqResetPassword(trimmedData).unwrap();

      router.replace(`/confirm-password-reset?requestId=${result.id}`);
    } catch (error) {
      const err = error as FetchBaseQueryError;
      const status = err.status;

      if (status === 429) {
        const retryAfter = (err.data as { retryAfter: string }).retryAfter;
        show429Toast(retryAfter, ToastKeysEnum.PASSWORD_RESET_CONFIRMATION);

        return;
      }

      if (status === 403) {
        const code = (err.data as { code?: string })?.code;

        if (code === 'EBADCSRFTOKEN') {
          return;
        }

        showToast({
          severity: 'error',
          summary: tForms('loginForm.error429'),
          detail: (
            <p>
              {tForms.rich('loginForm.error429_15Details', {
                cta: (chunks) => (
                  <Button variant="link" color="blue" onClick={support}>
                    {chunks}
                  </Button>
                ),
              })}
            </p>
          ),
          life: 10000,
          actionKey: ToastKeysEnum.PASSWORD_RESET_CONFIRMATION,
        });
        return;
      }

      setError(true);
    }
  };

  return (
    <form
      noValidate
      className={styles['request-password-reset-form']}
      onSubmit={handleSubmit(onSubmit)}
    >
      {isError && (
        <div className={styles['request-password-reset-form__error']}>
          <Image
            src="/images/alert-circle.svg"
            alt={'alert'}
            width={16}
            height={16}
          />
          <p className={styles['request-password-reset-form__error-text']}>
            {tForms('requestPasswordResetForm.error')}
          </p>
        </div>
      )}
      <fieldset disabled={isLoading}>
        <Input
          label="Email"
          placeholder="example@email.com"
          type="email"
          {...register('email')}
        />
      </fieldset>
      <Button
        color="green"
        type="submit"
        fullWidth
        loading={isLoading}
        isLoader
      >
        {tButtons('send')}
      </Button>
    </form>
  );
}
