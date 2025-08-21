'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '@/api/authApi';
import React, { ReactElement, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import styles from './RegistrationForm.module.scss';
import Input from '@/shared/components/Input/Input';
import Button from '@/shared/components/Button/Button';
import { blackListPasswords } from '@/shared/constants/black-list-passwords';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import Link from 'next/link';
import Checkbox from '@/assets/icons/checkbox-empty.svg';
import CheckboxChecked from '@/assets/icons/checkbox-checked.svg';
import PasswordStrengthIndicator from '@/shared/components/PasswordStrengthIndicator/PasswordStrengthIndicator';
import { getPasswordStrength } from '@/shared/utils/getPasswordStrength';
import { registrationSchema } from '../../../../shared/forms/schemas/registrationSchema';

type FormData = z.infer<typeof registrationSchema>;

export default function RegistrationForm(): ReactElement {
  const {
    register,
    trigger,
    watch,
    handleSubmit,
    formState: { errors, dirtyFields, isSubmitted },
  } = useForm<FormData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange',
  });

  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const password = watch('password');
  const agreement = watch('agreement');
  const passwordStrength = getPasswordStrength(
    password,
    firstName,
    lastName,
    blackListPasswords,
  );

  useEffect(() => {
    if (dirtyFields.confirmPassword) {
      trigger('confirmPassword');
    }
  }, [password, trigger, dirtyFields.confirmPassword]);

  useEffect(() => {
    trigger('password');
  }, [firstName, lastName, trigger]);

  const router = useRouter();
  const [registration, { isLoading }] = useRegisterMutation();
  const { showToast, isActive } = useToast();

  const onSubmit = async (data: FormData): Promise<void> => {
    if (errors.email?.message || isActive('register')) {
      return;
    }

    const trimmedData = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim(),
      password: data.password,
    };
    const result = await registration(trimmedData);

    if ('error' in result) {
      const errorData = result.error as
        | ((FetchBaseQueryError | SerializedError) & { status: number })
        | undefined;
      const status = errorData?.status;

      if (status === 409) {
        showToast({
          severity: 'error',
          summary: 'Ця електронна пошта вже використовується.',
          detail: 'Спробуй іншу електронну пошту.',
          life: 3000,
          actionKey: 'register',
        });
        return;
      }

      showToast({
        severity: 'error',
        summary: 'Виникла помилка під час реєстрації.',
        detail: 'Спробуй пізніше.',
        life: 3000,
        actionKey: 'register',
      });
      return;
    }

    router.push('/confirm-email?type=registration');
  };

  return (
    <form
      noValidate
      className={styles['registration-form']}
      onSubmit={handleSubmit(onSubmit)}
    >
      <fieldset
        className={styles['registration-form__fieldset']}
        disabled={isLoading}
      >
        <Input
          label="Ім'я"
          placeholder="Ім'я"
          {...register('firstName')}
          withError
          errorMessages={
            errors.firstName?.message && [errors.firstName.message]
          }
        />
        <Input
          label="Прізвище"
          placeholder="Прізвище"
          {...register('lastName')}
          withError
          errorMessages={errors.lastName?.message && [errors.lastName.message]}
        />
        <Input
          label="Email"
          placeholder="example@email.com"
          type="email"
          {...register('email')}
          withError
          errorMessages={errors.email?.message && [errors.email.message]}
        />
        <Input
          autoComplete="new-password"
          label="Пароль"
          placeholder="Пароль"
          type="password"
          {...register('password')}
          withError
          errorMessages={
            errors.password &&
            (dirtyFields.password || isSubmitted) &&
            errors.password.message
              ? [errors.password.message]
              : undefined
          }
        />
        <PasswordStrengthIndicator strength={passwordStrength} />
        <Input
          label="Повторити пароль"
          placeholder="Повторити пароль"
          type="password"
          {...register('confirmPassword')}
          withError
          errorMessages={
            errors.confirmPassword &&
            (dirtyFields.confirmPassword || isSubmitted) &&
            errors.confirmPassword.message
              ? [errors.confirmPassword.message]
              : undefined
          }
        />
        <div>
          <div className={styles['registration-form__checkbox-wrapper']}>
            <p className={styles['registration-form__checkbox-label']}>
              Я погоджуюсь з{' '}
              <Link
                className={styles['registration-form__link']}
                href="/legal-terms"
              >
                Умовами використання
              </Link>{' '}
              та{' '}
              <Link
                className={styles['registration-form__link']}
                href="/privacy-policy"
              >
                Політикою конфіденційності
              </Link>
            </p>
            <label htmlFor="checkbox">
              {agreement ? (
                <CheckboxChecked
                  className={styles['registration-form__icon']}
                />
              ) : (
                <Checkbox className={styles['registration-form__icon']} />
              )}
            </label>
            <input
              className={styles['registration-form__checkbox']}
              id="checkbox"
              type="checkbox"
              {...register('agreement')}
            />
          </div>
          {errors.agreement ? (
            <p className={styles['registration-form__checkbox-error']}>
              {errors.agreement.message}
            </p>
          ) : (
            <p className={styles['registration-form__checkbox-error']}></p>
          )}
        </div>
      </fieldset>
      <Button
        type="submit"
        size="md"
        color="green"
        fullWidth={true}
        loading={isLoading}
      >
        Зареєструватися
      </Button>
    </form>
  );
}
