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
import { hardSkillSchema } from '@/shared/forms/schemas/hardSkillSchema';

type FormData = z.infer<typeof hardSkillSchema>;

interface SoftSkillFormProps {
  onCancel: () => void;
}

export default function HardSkillForm(props: SoftSkillFormProps): ReactElement {
  const [addHardSkill, { isLoading }] = useAddHardSkillMutation();
  const { showToast, isActive } = useToast();
  const { onCancel } = props;
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(hardSkillSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    setFocus('hardSkillName');
  }, [setFocus]);

  const onSubmit = async (data: FormData): Promise<void> => {
    if (isActive('hard skill')) {
      return;
    }

    const result = await addHardSkill(data);
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
          actionKey: 'hard skill',
        });
        return;
      }
      return;
    }
    onCancel();
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
          label="Хард скіл"
          placeholder="JavaScript, Figma, SQL..."
          withError
          errorMessages={
            errors.hardSkillName?.message && [errors.hardSkillName.message]
          }
        />
      </fieldset>
      <Button
        type="submit"
        fullWidth
        color="green"
        disabled={!isValid}
        loading={isLoading}
      >
        Зберегти
      </Button>
    </form>
  );
}
