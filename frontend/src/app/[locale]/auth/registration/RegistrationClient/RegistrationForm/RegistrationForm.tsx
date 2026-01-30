'use client';

import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
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
import { Link } from '@/i18n/routing';
import Checkbox from '@/assets/icons/checkbox-empty.svg';
import CheckboxChecked from '@/assets/icons/checkbox-checked.svg';
import PasswordStrengthIndicator from '@/shared/components/PasswordStrengthIndicator/PasswordStrengthIndicator';
import { getPasswordStrength } from '@/shared/utils/getPasswordStrength';
import {
  registrationSchema,
  registrationSchemaStatic,
} from '@/shared/forms/schemas/registrationSchema';
import { normalizeApostrophes } from '@/shared/utils/normalizeApostrophes';
import { useTranslations } from 'next-intl';

type FormData = z.infer<typeof registrationSchemaStatic>;

export default function RegistrationForm(): ReactElement {
  const tForms = useTranslations('forms');
  const tButtons = useTranslations('buttons');
  const {
    register,
    trigger,
    watch,
    handleSubmit,
    control,
    formState: { errors, dirtyFields, isSubmitted },
  } = useForm<FormData>({
    resolver: zodResolver(registrationSchema(tForms)),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreement: false,
    },
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
          summary: tForms('registrationForm.error409'),
          detail: tForms('registrationForm.error409Details'),
          life: 3000,
          actionKey: 'register',
        });
        return;
      }

      showToast({
        severity: 'error',
        summary: tForms('registrationForm.error'),
        detail: tForms('registrationForm.errorDetails'),
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
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <Input
              label={tForms('registrationForm.firstName')}
              placeholder={tForms('registrationForm.placeholders.firstName')}
              {...field}
              onChange={(e) => {
                const normalized = normalizeApostrophes(e.target.value);
                field.onChange(normalized);
              }}
              withError
              errorMessages={
                errors.firstName?.message && [errors.firstName.message]
              }
            />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <Input
              label={tForms('registrationForm.lastName')}
              placeholder={tForms('registrationForm.placeholders.lastName')}
              {...field}
              onChange={(e) => {
                const normalized = normalizeApostrophes(e.target.value);
                field.onChange(normalized);
              }}
              withError
              errorMessages={
                errors.lastName?.message && [errors.lastName.message]
              }
            />
          )}
        />
        <Input
          label={tForms('registrationForm.email')}
          placeholder="example@email.com"
          type="email"
          {...register('email')}
          withError
          errorMessages={errors.email?.message && [errors.email.message]}
        />
        <Input
          autoComplete="new-password"
          label={tForms('registrationForm.password')}
          placeholder={tForms('registrationForm.placeholders.password')}
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
          label={tForms('registrationForm.confirm')}
          placeholder={tForms('registrationForm.placeholders.confirm')}
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
            <label htmlFor="checkbox">
              {agreement ? (
                <CheckboxChecked
                  className={styles['registration-form__icon']}
                />
              ) : (
                <Checkbox className={styles['registration-form__icon']} />
              )}
            </label>
            <p className={styles['registration-form__checkbox-label']}>
              {tForms.rich('registrationForm.agreement', {
                terms: (chunks) => (
                  <Link
                    className={styles['registration-form__link']}
                    href="/terms-of-use"
                    target="_blank"
                  >
                    {chunks}
                  </Link>
                ),
                privacy: (chunks) => (
                  <Link
                    className={styles['registration-form__link']}
                    href="/privacy-policy"
                    target="_blank"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
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
        isLoader
      >
        {tButtons('signUp')}
      </Button>
    </form>
  );
}
