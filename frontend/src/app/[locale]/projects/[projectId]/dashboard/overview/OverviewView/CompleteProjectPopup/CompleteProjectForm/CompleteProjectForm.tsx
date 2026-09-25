'use client';

import React, { ReactElement } from 'react';
import styles from './CompleteProjectForm.module.scss';
import { useForm } from 'react-hook-form';
import Input from '@/shared/components/Input/Input';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  completeProjectSchema,
  completeProjectSchemaStatic,
} from '@/shared/forms/schemas/completeProjectSchema';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { useCompleteProjectMutation } from '@/api/projectsApi';
import { useToast } from '@/hooks/useToast';
import { z } from 'zod';
import Button from '@/shared/components/Button/Button';
import { normalizeUrl } from '@/shared/utils/normalizeUrl';

interface CompleteProjectFormProps {
  id: string;
  onClose: () => void;
}

type FormData = z.infer<typeof completeProjectSchemaStatic>;

export default function CompleteProjectForm(
  props: CompleteProjectFormProps,
): ReactElement {
  const { id, onClose } = props;
  const tPopup = useTranslations('completeProjectPopup');
  const tButtons = useTranslations('buttons');
  const tForms = useTranslations('forms');
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(completeProjectSchema(tForms)),
    mode: 'onChange',
  });
  const [completeProject, { isLoading }] = useCompleteProjectMutation();
  const { showToast, isActive } = useToast();

  const onSubmit = async (data: FormData): Promise<void> => {
    if (isActive(ToastKeysEnum.PROJECT)) {
      return;
    }

    try {
      await completeProject({
        id,
        data: {
          ...data,
          publicUrl: data.publicUrl ? normalizeUrl(data.publicUrl) : undefined,
        },
      }).unwrap();

      showToast({
        severity: 'success',
        summary: tPopup('success'),
        life: 3000,
        actionKey: ToastKeysEnum.PROJECT,
      });
    } catch {
      showToast({
        severity: 'error',
        summary: tPopup('error'),
        life: 3000,
        actionKey: ToastKeysEnum.PROJECT,
      });
    } finally {
      onClose();
    }
  };
  return (
    <form
      className={styles['complete-project-form']}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <fieldset
        className={styles['complete-project-form__fieldset']}
        disabled={isLoading}
      >
        <Input
          label={tForms('completeProjectForm.publicUrl')}
          placeholder={tForms('completeProjectForm.placeholders.publicUrl')}
          type="url"
          {...register('publicUrl')}
          withError
          errorMessage={errors.publicUrl?.message}
        />
      </fieldset>
      <div className={styles['complete-project-form__actions']}>
        <Button color="green" variant="secondary-frame" onClick={onClose}>
          {tButtons('cancel')}
        </Button>
        <Button color="green" type="submit" loading={isLoading}>
          {tButtons('confirm')}
        </Button>
      </div>
    </form>
  );
}
