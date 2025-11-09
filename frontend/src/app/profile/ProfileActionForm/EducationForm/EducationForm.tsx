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
import { educationSchema } from '@/shared/forms/schemas/educationSchema';
import Autocomplete from '@/shared/components/Autocomplete/Autocomplete';

type FormData = z.infer<typeof educationSchema>;

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
  const {
    handleSubmit,
    control,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(educationSchema),
    mode: 'onChange',
    defaultValues: {
      institution: '',
      specialization: '',
    },
  });

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
    if (initialValues) {
      await updateEducation({ id: initialValues.id, data });
    } else {
      await addEducation(data);
    }
    onCancel();
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
              label="Освітній заклад"
              placeholder="Освітній заклад"
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
              label="Спеціальність"
              placeholder="Front-end Development, QA Engineering, UX/UI Design..."
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
          Скасувати
        </Button>
        <Button type="submit" color="green">
          Зберегти
        </Button>
      </div>
    </form>
  );
}
