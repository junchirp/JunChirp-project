'use client';

import { ReactElement, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/shared/components/Button/Button';
import styles from './SoftSkillForm.module.scss';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useToast } from '@/hooks/useToast';
import {
  useAddSoftSkillMutation,
  useLazyGetSoftSkillsListQuery,
  useUpdateSoftSkillMutation,
} from '@/api/softSkillsApi';
import {
  softSkillSchema,
  softSkillSchemaStatic,
} from '@/shared/forms/schemas/softSkillSchema';
import { useTranslations } from 'next-intl';
import Autocomplete from '@/shared/components/Autocomplete/Autocomplete';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { normalizeInputValue } from '@/shared/utils/normalizeInputValue';
import { SoftSkillInterface } from '@/shared/interfaces/soft-skill.interface';

type FormData = z.infer<typeof softSkillSchemaStatic>;

interface SoftSkillFormProps {
  initialValues?: SoftSkillInterface;
  onCancel: () => void;
}

export default function SoftSkillForm(props: SoftSkillFormProps): ReactElement {
  const [addSoftSkill, { isLoading: addSkillLoading }] =
    useAddSoftSkillMutation();
  const [updateSoftSkill, { isLoading: updateSkillLoading }] =
    useUpdateSoftSkillMutation();
  const [getSkills] = useLazyGetSoftSkillsListQuery();
  const { showToast, isActive } = useToast();
  const { initialValues, onCancel } = props;
  const tForms = useTranslations('forms');
  const tButtons = useTranslations('buttons');
  const {
    handleSubmit,
    reset,
    setFocus,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(softSkillSchema(tForms)),
    mode: 'onChange',
    defaultValues: {
      softSkillName: '',
    },
  });

  useEffect(() => {
    setFocus('softSkillName');
  }, [setFocus]);

  useEffect(() => {
    if (initialValues) {
      reset({
        softSkillName: initialValues.softSkillName,
      });
    } else {
      reset({
        softSkillName: '',
      });
    }
  }, [initialValues, reset]);

  const onSubmit = async (data: FormData): Promise<void> => {
    if (isActive(ToastKeysEnum.SOFT_SKILL)) {
      return;
    }

    const trimmedData = { softSkillName: data.softSkillName.trim() };

    try {
      if (initialValues) {
        await updateSoftSkill({
          id: initialValues.id,
          data: trimmedData,
        }).unwrap();
      } else {
        await addSoftSkill(trimmedData).unwrap();
      }

      showToast({
        severity: 'success',
        summary: tForms('softSkillForm.success'),
        life: 3000,
        actionKey: ToastKeysEnum.SOFT_SKILL,
      });
      onCancel();
    } catch (error) {
      const errorData = error as
        | ((FetchBaseQueryError | SerializedError) & {
            status: number;
          })
        | undefined;
      const status = errorData?.status;

      showToast({
        severity: 'error',
        summary:
          status === 409
            ? tForms('softSkillForm.error409')
            : tForms('softSkillForm.error'),
        life: 3000,
        actionKey: ToastKeysEnum.SOFT_SKILL,
      });
    }
  };

  return (
    <form
      className={styles['soft-skill-form']}
      onSubmit={handleSubmit(onSubmit)}
    >
      <fieldset
        className={styles['soft-skill-form__fieldset']}
        disabled={addSkillLoading || updateSkillLoading}
      >
        <Controller
          name="softSkillName"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              label={tForms('softSkillForm.softSkillName')}
              placeholder={tForms('softSkillForm.placeholders.softSkillName')}
              fetcher={(query) => getSkills(query)}
              onSelectOption={() => {}}
              onChange={(e) => {
                const normalized = normalizeInputValue(e.target.value);
                field.onChange(normalized);
              }}
              errorMessage={errors.softSkillName?.message}
              withError
            />
          )}
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
        <Button
          type="submit"
          color="green"
          loading={addSkillLoading || updateSkillLoading}
        >
          {tButtons('save')}
        </Button>
      </div>
    </form>
  );
}
