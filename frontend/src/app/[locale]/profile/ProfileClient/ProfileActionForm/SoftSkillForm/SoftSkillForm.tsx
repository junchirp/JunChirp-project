'use client';

import { ReactElement, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/shared/components/Input/Input';
import Button from '@/shared/components/Button/Button';
import styles from './SoftSkillForm.module.scss';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useToast } from '@/hooks/useToast';
import { useAddSoftSkillMutation } from '@/api/softSkillsApi';
import {
  softSkillSchema,
  softSkillSchemaStatic,
} from '@/shared/forms/schemas/softSkillSchema';
import { useTranslations } from 'next-intl';

type FormData = z.infer<typeof softSkillSchemaStatic>;

interface SoftSkillFormProps {
  onCancel: () => void;
}

export default function SoftSkillForm(props: SoftSkillFormProps): ReactElement {
  const [addSoftSkill, { isLoading }] = useAddSoftSkillMutation();
  const { showToast, isActive } = useToast();
  const { onCancel } = props;
  const tForms = useTranslations('forms');
  const tButtons = useTranslations('buttons');
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(softSkillSchema(tForms)),
    mode: 'onChange',
  });

  useEffect(() => {
    setFocus('softSkillName');
  }, [setFocus]);

  const onSubmit = async (data: FormData): Promise<void> => {
    if (isActive('soft skill')) {
      return;
    }

    const trimmedData = { softSkillName: data.softSkillName.trim() };
    const result = await addSoftSkill(trimmedData);
    if ('error' in result) {
      const errorData = result.error as
        | ((FetchBaseQueryError | SerializedError) & {
            status: number;
          })
        | undefined;
      const status = errorData?.status;

      if (status === 409) {
        showToast({
          severity: 'error',
          summary: `${tForms('softSkillForm.error409')}`,
          life: 3000,
          actionKey: 'soft skill',
        });
      } else {
        showToast({
          severity: 'error',
          summary: `${tForms('softSkillForm.error')}`,
          life: 3000,
          actionKey: 'soft skill',
        });
      }
      return;
    }
    if ('data' in result) {
      showToast({
        severity: 'success',
        summary: `${tForms('softSkillForm.success')}`,
        life: 3000,
        actionKey: 'soft skill',
      });
      onCancel();
    }
  };

  return (
    <form
      className={styles['soft-skill-form']}
      onSubmit={handleSubmit(onSubmit)}
    >
      <fieldset
        className={styles['soft-skill-form__fieldset']}
        disabled={isLoading}
      >
        <Input
          {...register('softSkillName')}
          label={tForms('softSkillForm.softSkillName')}
          placeholder={tForms('softSkillForm.placeholders.softSkillName')}
          withError
          errorMessages={
            errors.softSkillName?.message && [errors.softSkillName.message]
          }
        />
      </fieldset>
      <div className={styles['soft-skill-form__actions']}>
        <Button
          type="button"
          variant="secondary-frame"
          color="green"
          onClick={onCancel}
        >
          {tButtons('cancel')}
        </Button>
        <Button type="submit" color="green">
          {tButtons('save')}
        </Button>
      </div>
    </form>
  );
}
