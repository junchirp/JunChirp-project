'use client';

import { ReactElement } from 'react';
import Input from '@/shared/components/Input/Input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/useToast';
import { useUpdateEmailMutation } from '@/api/authApi';
import styles from './ChangeEmailForm.module.scss';
import Button from '@/shared/components/Button/Button';
import {
  availableEmailSchema,
  availableEmailSchemaStatic,
} from '@/shared/forms/schemas/availableEmailSchema';
import { useLocale, useTranslations } from 'next-intl';
import { Locale } from '@/i18n/routing';

type FormData = z.infer<typeof availableEmailSchemaStatic>;

interface FormProps {
  onClose: () => void;
}

export default function ChangeEmailForm({ onClose }: FormProps): ReactElement {
  const tForms = useTranslations('forms');
  const tButtons = useTranslations('buttons');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(availableEmailSchema(tForms)),
    mode: 'onChange',
  });

  const [updateEmail, { isLoading }] = useUpdateEmailMutation();
  const { showToast, isActive } = useToast();
  const locale = useLocale();

  const onSubmit = async (data: FormData): Promise<void> => {
    if (errors.email?.message || isActive('change email')) {
      return;
    }
    const trimmedData = {
      email: data.email.trim(),
      locale: locale as Locale,
    };
    const result = await updateEmail(trimmedData);

    if ('data' in result) {
      showToast({
        severity: 'success',
        summary: tForms('changeEmailForm.success'),
        detail: tForms('changeEmailForm.successDetails'),
        life: 3000,
        actionKey: 'change email',
      });
    } else if ('error' in result) {
      showToast({
        severity: 'error',
        summary: tForms('changeEmailForm.error'),
        detail: tForms('changeEmailForm.errorDetails'),
        life: 3000,
        actionKey: 'change email',
      });
    }

    onClose();
  };

  return (
    <form
      noValidate
      className={styles['change-email-form']}
      onSubmit={handleSubmit(onSubmit)}
    >
      <fieldset disabled={isLoading}>
        <Input
          label={tForms('changeEmailForm.email')}
          placeholder="example@email.com"
          type="email"
          {...register('email')}
          withError
          errorMessages={errors.email?.message && [errors.email.message]}
        />
      </fieldset>
      <div className={styles['change-email-form__buttons']}>
        <Button
          color="green"
          variant="secondary-frame"
          type="button"
          fullWidth
          onClick={onClose}
        >
          {tButtons('cancel')}
        </Button>
        <Button color="green" type="submit" fullWidth loading={isLoading}>
          {tButtons('changeEmail')}
        </Button>
      </div>
    </form>
  );
}
