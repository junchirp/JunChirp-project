'use client';

import React, { ReactElement, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './RequestPasswordResetForm.module.scss';
import Input from '@/shared/components/Input/Input';
import Button from '@/shared/components/Button/Button';
import { useRequestPasswordResetMutation } from '@/api/authApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { Locale, useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useError429Toast } from '@/hooks/useError429Toast';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';

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
  const { showToast, isActive } = useError429Toast();
  const router = useRouter();
  const locale = useLocale();
  const [isError, setError] = useState(false);

  const onSubmit = async (data: FormData): Promise<void> => {
    if (isActive(ToastKeysEnum.PASSWORD_RESET_CONFIRMATION)) {
      return;
    }

    setError(false);
    const trimmedData = {
      email: data.email.trim(),
      locale: locale as Locale,
    };
    const result = await reqResetPassword(trimmedData);

    if ('error' in result) {
      const errorData = result.error as
        | ((FetchBaseQueryError | SerializedError) & {
            status: number;
            data: { attemptsCount: number; retryAfter: string };
          })
        | undefined;
      const status = errorData?.status;

      if (status === 429) {
        showToast(
          errorData?.data.retryAfter ?? '',
          ToastKeysEnum.PASSWORD_RESET_CONFIRMATION,
        );
      } else {
        setError(true);
      }
    } else if ('data' in result) {
      router.replace(`/confirm-password-reset?requestId=${result.data}`);
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
