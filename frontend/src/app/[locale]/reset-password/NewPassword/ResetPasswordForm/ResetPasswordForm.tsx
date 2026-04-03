'use client';

import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import styles from './ResetPasswordForm.module.scss';
import Button from '@/shared/components/Button/Button';
import Input from '@/shared/components/Input/Input';
import PasswordStrengthIndicator
  from '@/shared/components/PasswordStrengthIndicator/PasswordStrengthIndicator';
import { z } from 'zod';
import { blackListPasswords } from '@/shared/constants/black-list-passwords';
import { useRouter } from '@/i18n/routing';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getPasswordStrength } from '@/shared/utils/getPasswordStrength';
import { useCancelResetPasswordMutation, useResetPasswordMutation, } from '@/api/authApi';
import { useToast } from '@/hooks/useToast';
import CancelPasswordPopup from './CancelPasswordPopup/CancelPasswordPopup';
import { passwordSchemaStatic } from '@/shared/forms/schemas/passwordSchema';
import { resetPasswordSchema } from '@/shared/forms/schemas/resetPasswordSchema';
import { useTranslations } from 'next-intl';
import { RecoveryPasswordInterface } from '@/shared/interfaces/recovery-password.interface';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';

type FormData = z.infer<typeof passwordSchemaStatic>;

interface ResetPasswordFormProps {
  recoveryData: RecoveryPasswordInterface;
}

export default function ResetPasswordForm({
  recoveryData,
}: ResetPasswordFormProps): ReactElement {
  const { firstName, lastName, token } = recoveryData;
  const router = useRouter();
  const { showToast, isActive } = useToast();
  const [resetPassword, { isLoading: isResetLoading }] =
    useResetPasswordMutation();
  const [cancelResetPassword, { isLoading: isCancelLoading }] =
    useCancelResetPasswordMutation();
  const [isModalOpen, setModalOpen] = useState(false);
  const tForms = useTranslations('forms');
  const tButtons = useTranslations('buttons');

  const schema = useMemo(
    () => resetPasswordSchema(tForms, firstName, lastName),
    [firstName, lastName],
  );

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, dirtyFields, isSubmitted },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const password = watch('password');
  const passwordStrength = getPasswordStrength(
    password,
    firstName,
    lastName,
    blackListPasswords,
  );

  useEffect(() => {
    if (dirtyFields.confirmPassword || dirtyFields.password) {
      trigger();
    }
  }, [password, trigger, dirtyFields.confirmPassword, dirtyFields.password]);

  const closeModal = (): void => setModalOpen(false);
  const openModal = (): void => setModalOpen(true);

  const onSubmit = async (data: FormData): Promise<void> => {
    if (isActive(ToastKeysEnum.RESET_PASSWORD)) {
      return;
    }

    const result = await resetPassword({ token, password: data.password });

    if ('error' in result) {
      showToast({
        severity: 'error',
        summary: tForms('resetPasswordForm.error'),
        detail: tForms('resetPasswordForm.errorDetails'),
        life: 3000,
        actionKey: ToastKeysEnum.RESET_PASSWORD,
      });
      return;
    }

    showToast({
      severity: 'success',
      summary: tForms('resetPasswordForm.success'),
      life: 3000,
      actionKey: ToastKeysEnum.RESET_PASSWORD,
    });

    router.push('/auth/login');
  };

  const cancelReset = async (): Promise<void> => {
    if (isActive(ToastKeysEnum.RESET_PASSWORD)) {
      return;
    }

    await cancelResetPassword(encodeURIComponent(token));
    showToast({
      severity: 'success',
      summary: tForms('resetPasswordForm.successCancel'),
      detail: tForms('resetPasswordForm.successCancelDetails'),
      life: 3000,
      actionKey: ToastKeysEnum.RESET_PASSWORD,
    });

    setModalOpen(false);
    router.push('/auth/login');
  };

  return (
    <>
      <form
        className={styles['reset-password-form']}
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset
          className={styles['reset-password-form__fieldset']}
          disabled={isResetLoading || isCancelLoading}
        >
          <Input
            autoComplete="new-password"
            label={tForms('resetPasswordForm.password')}
            placeholder={tForms('resetPasswordForm.placeholders.password')}
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
            label={tForms('resetPasswordForm.confirm')}
            placeholder={tForms('resetPasswordForm.placeholders.confirm')}
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
        </fieldset>
        <div className={styles['reset-password-form__buttons']}>
          <Button
            type="button"
            color="green"
            variant="secondary-frame"
            onClick={openModal}
            loading={isResetLoading || isCancelLoading}
          >
            {tButtons('cancel')}
          </Button>
          <Button
            type="submit"
            color="green"
            loading={isResetLoading || isCancelLoading}
          >
            {tButtons('save')}
          </Button>
        </div>
      </form>
      {isModalOpen && (
        <CancelPasswordPopup onConfirm={cancelReset} onCancel={closeModal} />
      )}
    </>
  );
}
