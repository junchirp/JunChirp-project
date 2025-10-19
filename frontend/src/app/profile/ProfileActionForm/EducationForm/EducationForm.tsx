'use client';

import { ReactElement, useEffect, useRef } from 'react';
import { z } from 'zod';
import { EducationInterface } from '@/shared/interfaces/education.interface';
import { selectAllProjectRolesList } from '@/redux/projectRolesList/projectRolesListSlice';
import styles from './EducationForm.module.scss';
import { Controller, useForm } from 'react-hook-form';
import Button from '@/shared/components/Button/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import EducationAutocomplete from '@/shared/components/EducationAutocomplete/EducationAutocomplete';
import {
  useAddEducationMutation,
  useUpdateEducationMutation,
} from '@/api/educationsApi';
import { useAppSelector } from '@/hooks/reduxHooks';
import { educationSchema } from '@/shared/forms/schemas/educationSchema';
import Dropdown from '@/shared/components/Dropdown/Dropdown';
import { ProjectRoleTypeInterface } from '@/shared/interfaces/project-role-type.interface';

type FormData = z.infer<typeof educationSchema>;

interface EducationFormProps {
  initialValues?: EducationInterface;
  onCancel: () => void;
}

export default function EducationForm(props: EducationFormProps): ReactElement {
  const specializationList = useAppSelector(selectAllProjectRolesList);
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
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(educationSchema),
    mode: 'onChange',
    defaultValues: {
      institution: '',
      specializationId: '',
    },
  });

  useEffect(() => {
    setFocus('institution');
  }, [setFocus]);

  useEffect(() => {
    if (initialValues) {
      reset({
        institution: initialValues.institution,
        specializationId: initialValues.specialization.id,
      });
    } else {
      reset({
        institution: '',
        specializationId: '',
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
            <EducationAutocomplete
              {...field}
              label="Освітній заклад"
              placeholder="Освітній заклад"
              onSelectEducation={() => {}}
              errorMessages={
                errors.institution?.message && [errors.institution.message]
              }
              withError
            />
          )}
        />
        <Controller
          name="specializationId"
          control={control}
          render={({ field }) => (
            <Dropdown<ProjectRoleTypeInterface>
              {...field}
              options={specializationList}
              label="Спеціальність"
              placeholder="Спеціальність (бажана роль на проєкті)"
              getOptionLabel={(o) => o.roleName}
              getOptionValue={(o) => o.id}
            />
          )}
        />
      </fieldset>

      {initialValues ? (
        <div className={styles['education-form__actions']}>
          <Button
            type="button"
            variant="secondary-frame"
            color="green"
            onClick={onCancel}
          >
            Скасувати
          </Button>
          <Button type="submit" color="green" disabled={!isValid}>
            Зберегти
          </Button>
        </div>
      ) : (
        <Button type="submit" fullWidth color="green" disabled={!isValid}>
          Зберегти
        </Button>
      )}
    </form>
  );
}
