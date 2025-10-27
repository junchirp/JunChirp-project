'use client';

import { ReactElement } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './RequestPasswordResetForm.module.scss';
import Input from '@/shared/components/Input/Input';
import Button from '@/shared/components/Button/Button';
import { useToast } from '@/hooks/useToast';
import { useRequestPasswordResetMutation } from '@/api/authApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useRouter } from 'next/navigation';
import { usedEmailSchema } from '@/shared/forms/schemas/usedEmailSchema';

type FormData = z.infer<typeof usedEmailSchema>;

export default function RequestPasswordResetForm(): ReactElement {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(usedEmailSchema),
    mode: 'onChange',
  });
  const email = watch('email');
  const [reqResetPassword, { isLoading }] = useRequestPasswordResetMutation();
  const { showToast, isActive } = useToast();
  const router = useRouter();

  const onSubmit = async (data: FormData): Promise<void> => {
    if (errors.email?.message || isActive('request password reset')) {
      return;
    }

    const trimmedData = {
      email: data.email.trim(),
    };
    const result = await reqResetPassword(trimmedData);

    if ('error' in result) {
      const errorData = result.error as
        | ((FetchBaseQueryError | SerializedError) & {
            status: number;
            data: { attemptsCount: number };
          })
        | undefined;
      const status = errorData?.status;

      if (status === 429) {
        showToast({
          severity: 'error',
          summary:
            'Перевищено ліміт запитів на підтвердження запиту на відновлення пароля.',
          detail: 'Будь ласка, спробуй надіслати новий запит через 1 годину.',
          life: 10000,
          actionKey: 'request password reset',
        });

        return;
      }

      showToast({
        severity: 'error',
        summary: 'Невідома помилка.',
        detail: 'Спробуй пізніше.',
        life: 3000,
        actionKey: 'request password reset',
      });

      return;
    }

    router.push(`/confirm-password-reset?email=${encodeURIComponent(email)}`);
  };

  return (
    <form
      noValidate
      className={styles['request-password-reset-form']}
      onSubmit={handleSubmit(onSubmit)}
    >
      <fieldset disabled={isLoading}>
        <Input
          label="Email"
          placeholder="example@email.com"
          type="email"
          {...register('email')}
          withError
          errorMessages={errors.email?.message && [errors.email.message]}
        />
      </fieldset>
      <Button
        color="green"
        type="submit"
        fullWidth
        loading={isLoading}
        isLoader
      >
        Відправити запит
      </Button>
    </form>
  );
}
