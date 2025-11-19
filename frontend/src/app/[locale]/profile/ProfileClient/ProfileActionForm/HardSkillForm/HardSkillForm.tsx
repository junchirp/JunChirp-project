'use client';

import { ReactElement, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/shared/components/Input/Input';
import Button from '@/shared/components/Button/Button';
import styles from './HardSkillForm.module.scss';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useToast } from '@/hooks/useToast';
import { useAddHardSkillMutation } from '@/api/hardSkillsApi';
import {
  hardSkillSchema,
  hardSkillSchemaStatic,
} from '@/shared/forms/schemas/hardSkillSchema';
import { useTranslations } from 'next-intl';

type FormData = z.infer<typeof hardSkillSchemaStatic>;

interface HardSkillFormProps {
  onCancel: () => void;
}

export default function HardSkillForm(props: HardSkillFormProps): ReactElement {
  const [addHardSkill, { isLoading }] = useAddHardSkillMutation();
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
    resolver: zodResolver(hardSkillSchema(tForms)),
    mode: 'onChange',
  });

  useEffect(() => {
    setFocus('hardSkillName');
  }, [setFocus]);

  const onSubmit = async (data: FormData): Promise<void> => {
    if (isActive('hard skill')) {
      return;
    }

    const trimmedData = { hardSkillName: data.hardSkillName.trim() };
    const result = await addHardSkill(trimmedData);
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
          summary: `${tForms('hardSkillForm.error409')}`,
          life: 3000,
          actionKey: 'hard skill',
        });
      } else {
        showToast({
          severity: 'error',
          summary: `${tForms('hardSkillForm.error')}`,
          life: 3000,
          actionKey: 'hard skill',
        });
      }
      return;
    }
    if ('data' in result) {
      showToast({
        severity: 'success',
        summary: `${tForms('hardSkillForm.success')}`,
        life: 3000,
        actionKey: 'hard skill',
      });
      onCancel();
    }
  };

  return (
    <form
      className={styles['hard-skill-form']}
      onSubmit={handleSubmit(onSubmit)}
    >
      <fieldset
        className={styles['hard-skill-form__fieldset']}
        disabled={isLoading}
      >
        <Input
          {...register('hardSkillName')}
          label={tForms('hardSkillForm.hardSkillName')}
          placeholder={tForms('hardSkillForm.placeholders.hardSkillName')}
          withError
          errorMessages={
            errors.hardSkillName?.message && [errors.hardSkillName.message]
          }
        />
      </fieldset>
      <div className={styles['hard-skill-form__actions']}>
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
