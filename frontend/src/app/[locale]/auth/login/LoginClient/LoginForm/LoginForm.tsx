'use client';

import styles from './LoginForm.module.scss';
import Input from '../../../../../../shared/components/Input/Input';
import Button from '../../../../../../shared/components/Button/Button';
import { Link, useRouter } from '../../../../../../i18n/routing';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginMutation } from '../../../../../../api/authApi';
import { useSearchParams } from 'next/navigation';
import React, { ReactElement } from 'react';
import { useToast } from '../../../../../../hooks/useToast';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useLazyGetProjectRolesListQuery } from '../../../../../../api/projectRolesApi';
import { useSupport } from '../../../../../../hooks/useSupport';
import {
  loginSchema,
  loginSchemaStatic,
} from '../../../../../../shared/forms/schemas/loginShema';
import { useTranslations } from 'next-intl';

type FormData = z.infer<typeof loginSchemaStatic>;

export default function LoginForm(): ReactElement {
  const tForms = useTranslations('forms');
  const tButtons = useTranslations('buttons');
  const tAuth = useTranslations('auth');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema(tForms)),
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
            tForms('loginForm.error429'),
            <p>
              {tForms.rich('loginForm.error429_15Details', {
                cta: (chunks) => (
                  <Button variant="link" color="blue" onClick={support}>
                    {chunks}
                  </Button>
                ),
              })}
            </p>,
          ];
        } else if (attemptsCount === 10) {
          [summary, detail] = [
            tForms('loginForm.error429'),
            <p>
              {tForms.rich('loginForm.error429_10Details', {
                cta: (chunks) => (
                  <Button variant="link" color="blue" onClick={support}>
                    {chunks}
                  </Button>
                ),
              })}
            </p>,
          ];
        } else if (attemptsCount === 5) {
          [summary, detail] = [
            tForms('loginForm.error429'),
            <p>
              {tForms.rich('loginForm.error429_5Details', {
                cta: (chunks) => (
                  <Button variant="link" color="blue" onClick={support}>
                    {chunks}
                  </Button>
                ),
              })}
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
          summary: tForms('loginForm.error401'),
          detail: tForms('loginForm.error401Details'),
          life: 3000,
          actionKey: 'login',
        });
        return;
      }

      showToast({
        severity: 'error',
        summary: tForms('loginForm.error'),
        detail: tForms('loginForm.errorDetails'),
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
          label={tForms('loginForm.email')}
          type="email"
          placeholder="example@email.com"
          {...register('email')}
          withError
          errorMessages={errors.email?.message && [errors.email.message]}
        />
        <Input
          label={tForms('loginForm.password')}
          type="password"
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
          {tButtons('signIn')}
        </Button>
        <Link
          className={styles['login-form__link']}
          href="/request-password-reset"
        >
          {tAuth('forgotPassword')}
        </Link>
      </div>
    </form>
  );
}
