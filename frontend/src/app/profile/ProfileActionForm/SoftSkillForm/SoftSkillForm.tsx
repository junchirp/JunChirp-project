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
import { softSkillSchema } from '@/shared/forms/schemas/softSkillSchema';

type FormData = z.infer<typeof softSkillSchema>;

interface SoftSkillFormProps {
  onCancel: () => void;
}

export default function SoftSkillForm(props: SoftSkillFormProps): ReactElement {
  const [addSoftSkill, { isLoading }] = useAddSoftSkillMutation();
  const { showToast, isActive } = useToast();
  const { onCancel } = props;
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(softSkillSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    setFocus('softSkillName');
  }, [setFocus]);

  const onSubmit = async (data: FormData): Promise<void> => {
    if (isActive('soft skill')) {
      return;
    }

    const result = await addSoftSkill(data);
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
          summary: 'Ця навичка вже додана.',
          life: 3000,
          actionKey: 'soft skill',
        });
        return;
      }
      return;
    }
    onCancel();
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
          label="Софт скіл"
          placeholder="Командна робота, Тайм-менеджмент..."
          withError
          errorMessages={
            errors.softSkillName?.message && [errors.softSkillName.message]
          }
        />
      </fieldset>
      <Button type="submit" fullWidth color="green" disabled={!isValid}>
        Зберегти
      </Button>
    </form>
  );
}
