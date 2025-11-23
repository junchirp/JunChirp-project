'use client';

import { ReactElement, useEffect } from 'react';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './SupportForm.module.scss';
import Input from '@/shared/components/Input/Input';
import Button from '@/shared/components/Button/Button';
import { useSupportMutation } from '@/api/supportApi';
import { useToast } from '@/hooks/useToast';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import { RichEditor } from '@/shared/components/RichEditor/RichEditor';
import {
  supportSchema,
  supportSchemaStatic,
} from '@/shared/forms/schemas/supportSchema';
import { useLocale, useTranslations } from 'next-intl';
import { Locale } from '@/i18n/routing';

type FormData = z.infer<typeof supportSchemaStatic>;

interface SupportFormProps {
  user?: AuthInterface | null;
  onClose: () => void;
}

export default function SupportForm(props: SupportFormProps): ReactElement {
  const [sendSupportRequest, { isLoading }] = useSupportMutation();
  const { showToast, isActive } = useToast();
  const { user, onClose } = props;
  const t = useTranslations('forms');
  const locale = useLocale();
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(supportSchema(t)),
    mode: 'onChange',
    defaultValues: {
      email: '',
      requestText: '',
      requestHtml: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        requestText: '',
        requestHtml: '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: FormData): Promise<void> => {
    if (isActive('support')) {
      return;
    }

    const result = await sendSupportRequest({
      ...data,
      locale: locale as Locale,
    });
    onClose();

    if ('data' in result) {
      showToast({
        severity: 'success',
        summary: t('supportForm.success'),
        detail: t('supportForm.successDetails'),
        life: 3000,
        actionKey: 'support',
      });
    }

    if ('error' in result) {
      showToast({
        severity: 'error',
        summary: t('supportForm.error'),
        detail: t('supportForm.errorDetails'),
        life: 3000,
        actionKey: 'support',
      });
    }
  };

  return (
    <form className={styles['support-form']} onSubmit={handleSubmit(onSubmit)}>
      <fieldset
        className={styles['support-form__fieldset']}
        disabled={isLoading}
      >
        <Controller
          name="requestText"
          control={control}
          render={({ field }) => (
            <RichEditor
              value={field.value ?? ''}
              onChange={(html, text) => {
                field.onChange(text);
                setValue('requestHtml', html, { shouldValidate: true });
              }}
              label={t('supportForm.requestText')}
              placeholder={t('supportForm.placeholders.requestText')}
              withError
              errorMessages={
                errors.requestText?.message && [errors.requestText.message]
              }
            />
          )}
        />
      </fieldset>
      <div className={styles['support-form__button-wrapper']}>
        {!user && (
          <fieldset
            className={styles['support-form__fieldset']}
            disabled={isLoading}
          >
            <Input
              label="Email"
              placeholder="example@email.com"
              type="email"
              {...register('email')}
              withError
              errorMessages={errors.email?.message && [errors.email.message]}
            />
          </fieldset>
        )}
        <Button
          className={styles['support-form__button']}
          type="submit"
          color="green"
          loading={isLoading}
        >
          {t('supportForm.button')}
        </Button>
      </div>
    </form>
  );
}
