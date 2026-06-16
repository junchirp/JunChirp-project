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
import { useTranslations } from 'next-intl';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { normalizeInputValue } from '@/shared/utils/normalizeInputValue';
import { useShortLocale } from '@/hooks/useShortLocale';

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
  const locale = useShortLocale();
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
    if (isActive(ToastKeysEnum.SUPPORT)) {
      return;
    }

    try {
      await sendSupportRequest({ ...data, locale }).unwrap();

      showToast({
        severity: 'success',
        summary: t('supportForm.success'),
        detail: t('supportForm.successDetails'),
        life: 3000,
        actionKey: ToastKeysEnum.SUPPORT,
      });
    } catch {
      showToast({
        severity: 'error',
        summary: t('supportForm.error'),
        detail: t('supportForm.errorDetails'),
        life: 3000,
        actionKey: ToastKeysEnum.SUPPORT,
      });
    } finally {
      onClose();
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
                const normalized = normalizeInputValue(text);
                field.onChange(normalized);
                setValue('requestHtml', html, { shouldValidate: true });
              }}
              label={t('supportForm.requestText')}
              placeholder={t('supportForm.placeholders.requestText')}
              withError
              errorMessage={errors.requestText?.message}
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
              errorMessage={errors.email?.message}
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
