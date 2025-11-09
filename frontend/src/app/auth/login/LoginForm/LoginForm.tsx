'use client';

import styles from './LoginForm.module.scss';
import Input from '@/shared/components/Input/Input';
import Button from '@/shared/components/Button/Button';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginMutation } from '@/api/authApi';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { ReactElement } from 'react';
import { useToast } from '@/hooks/useToast';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useLazyGetProjectRolesListQuery } from '@/api/projectRolesApi';
import { useSupport } from '@/hooks/useSupport';
import { loginSchema } from '@/shared/forms/schemas/loginShema';

type FormData = z.infer<typeof loginSchema>;

export default function LoginForm(): ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const { showToast, isActive } = useToast();
  const [loadRoles] = useLazyGetProjectRolesListQuery();
  const support = useSupport();
  const searchParams = useSearchParams();

  const onSubmit = async (data: FormData): Promise<void> => {
    if (isActive('login')) {
      return;
    }

    const result = await login(data);

    if ('data' in result) {
      const user = result.data;

      if (user) {
        const next = searchParams.get('next');
        const isSafeNext =
          next && next.startsWith('/') && !next.startsWith('//');

        if (isSafeNext) {
          router.replace(next);
        } else if (user.isVerified) {
          loadRoles(undefined);
          router.replace('/');
        } else {
          router.replace('/confirm-email?type=login');
        }
      }
    }

    if ('error' in result) {
      const errorData = result.error as
        | ((FetchBaseQueryError | SerializedError) & {
            status: number;
            data: { attemptsCount: number };
          })
        | undefined;
      const status = errorData?.status;

      if (status === 429) {
        const attemptsCount = errorData?.data.attemptsCount ?? 0;

        let [summary, detail] = ['', <></>];
        if (attemptsCount === 15) {
          [summary, detail] = [
            'Твій обліковий запис заблоковано через невдалі спроби входу.',
            <p>
              Ти можеш повернути доступ до свого облікового запису звернувшись
              до нашої служби{' '}
              <Button
                className={styles['login-form__message-button']}
                variant="link"
                color="blue"
                onClick={support}
              >
                підтримки
              </Button>
              .
            </p>,
          ];
        } else if (attemptsCount === 10) {
          [summary, detail] = [
            'Твій обліковий запис заблоковано через невдалі спроби входу.',
            <p>
              Ти можеш повернути доступ до свого облікового запису через 1
              годину. Якщо тобі потрібна допомога, звернись до нашої служби{' '}
              <Button
                className={styles['login-form__message-button']}
                variant="link"
                color="blue"
                onClick={support}
              >
                підтримки
              </Button>
              .
            </p>,
          ];
        } else if (attemptsCount === 5) {
          [summary, detail] = [
            'Твій обліковий запис заблоковано через невдалі спроби входу.',
            <p>
              Ти можеш повернути доступ до свого облікового запису через 15
              хвилин. Якщо тобі потрібна допомога, звернись до нашої служби{' '}
              <Button
                className={styles['login-form__message-button']}
                variant="link"
                color="blue"
                onClick={support}
              >
                підтримки
              </Button>
              .
            </p>,
          ];
        }
        showToast({
          severity: 'error',
          summary,
          detail,
          life: 10000,
          actionKey: 'login',
        });
        return;
      }

      if (status === 401) {
        showToast({
          severity: 'error',
          summary: 'Схоже введено неправильну електронну пошту або пароль.',
          detail: 'Спробуй ще раз або віднови пароль.',
          life: 3000,
          actionKey: 'login',
        });
        return;
      }

      showToast({
        severity: 'error',
        summary: 'Виникла помилка під час входу.',
        detail: 'Спробуй пізніше.',
        life: 3000,
        actionKey: 'login',
      });
      return;
    }
  };

  return (
    <form
      noValidate
      className={styles['login-form']}
      onSubmit={handleSubmit(onSubmit)}
    >
      <fieldset className={styles['login-form__fieldset']} disabled={isLoading}>
        <Input
          label="Email"
          type="email"
          placeholder="example@email.com"
          {...register('email')}
          withError
          errorMessages={errors.email?.message && [errors.email.message]}
        />
        <Input
          label="Пароль"
          type="password"
          placeholder="Пароль"
          {...register('password')}
          withError
          errorMessages={errors.password?.message && [errors.password.message]}
        />
      </fieldset>
      <div className={styles['login-form__button-wrapper']}>
        <Button
          type="submit"
          size="md"
          color="green"
          fullWidth={true}
          loading={isLoading}
          isLoader
        >
          Увійти
        </Button>
        <Link
          className={styles['login-form__link']}
          href="/request-password-reset"
        >
          Забули пароль?
        </Link>
      </div>
    </form>
  );
}
