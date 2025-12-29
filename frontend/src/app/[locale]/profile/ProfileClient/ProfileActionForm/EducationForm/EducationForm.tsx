'use client';

import { ReactElement, useEffect } from 'react';
import { z } from 'zod';
import { EducationInterface } from '@/shared/interfaces/education.interface';
import styles from './EducationForm.module.scss';
import { Controller, useForm } from 'react-hook-form';
import Button from '@/shared/components/Button/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useAddEducationMutation,
  useLazyGetInstitutionsQuery,
  useLazyGetSpecializationsQuery,
  useUpdateEducationMutation,
} from '@/api/educationsApi';
import {
  educationSchema,
  educationSchemaStatic,
} from '@/shared/forms/schemas/educationSchema';
import Autocomplete from '@/shared/components/Autocomplete/Autocomplete';
import { useTranslations } from 'next-intl';
import { useToast } from '../../../../../../hooks/useToast';

type FormData = z.infer<typeof educationSchemaStatic>;

interface EducationFormProps {
  initialValues?: EducationInterface;
  onCancel: () => void;
}

export default function EducationForm(props: EducationFormProps): ReactElement {
  const [getInstitutions] = useLazyGetInstitutionsQuery();
  const [getSpecializations] = useLazyGetSpecializationsQuery();
  const [updateEducation, { isLoading: updateEducationLoading }] =
    useUpdateEducationMutation();
  const [addEducation, { isLoading: addEducationLoading }] =
    useAddEducationMutation();
  const { initialValues, onCancel } = props;
  const tForms = useTranslations('forms');
  const tButtons = useTranslations('buttons');
  const {
    handleSubmit,
    control,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(educationSchema(tForms)),
    mode: 'onChange',
    defaultValues: {
      institution: '',
      specialization: '',
    },
  });
  const { showToast, isActive } = useToast();

  useEffect(() => {
    setFocus('institution');
  }, [setFocus]);

  useEffect(() => {
    if (initialValues) {
      reset({
        institution: initialValues.institution,
        specialization: initialValues.specialization,
      });
    } else {
      reset({
        institution: '',
        specialization: '',
      });
    }
  }, [initialValues, reset]);

  const onSubmit = async (data: FormData): Promise<void> => {
    if (isActive('education')) {
      return;
    }

    if (initialValues) {
      const result = await updateEducation({
        id: initialValues.id,
        data,
      });
      if ('error' in result) {
        showToast({
          severity: 'error',
          summary: tForms('educationForm.error'),
          life: 3000,
          actionKey: 'education',
        });
        return;
      }
      if ('data' in result) {
        showToast({
          severity: 'success',
          summary: tForms('educationForm.success'),
          life: 3000,
          actionKey: 'education',
        });
        onCancel();
      }
    } else {
      const result = await addEducation(data);
      if ('error' in result) {
        showToast({
          severity: 'error',
          summary: tForms('educationForm.error'),
          life: 3000,
          actionKey: 'education',
        });
        return;
      }
      if ('data' in result) {
        showToast({
          severity: 'success',
          summary: tForms('educationForm.success'),
          life: 3000,
          actionKey: 'education',
        });
        onCancel();
      }
    }
  };

  return (
    <form
      className={styles['education-form']}
      onSubmit={handleSubmit(onSubmit)}
    >
      <fieldset
        className={styles['education-form__fieldset']}
        disabled={updateEducationLoading || addEducationLoading}
      >
        <Controller
          name="institution"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              label={tForms('educationForm.institution')}
              placeholder={tForms('educationForm.placeholders.institution')}
              fetcher={(query) => getInstitutions(query)}
              onSelectOption={() => {}}
              errorMessages={
                errors.institution?.message && [errors.institution.message]
              }
              withError
            />
          )}
        />
        <Controller
          name="specialization"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              label={tForms('educationForm.specialization')}
              placeholder={tForms('educationForm.placeholders.specialization')}
              fetcher={(query) => getSpecializations(query)}
              onSelectOption={() => {}}
              errorMessages={
                errors.specialization?.message && [
                  errors.specialization.message,
                ]
              }
              withError
            />
          )}
        />
      </fieldset>
      <div className={styles['education-form__actions']}>
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
          loading={updateEducationLoading || addEducationLoading}
        >
          {tButtons('save')}
        </Button>
      </div>
    </form>
  );
}
