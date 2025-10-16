'use client';

import { ReactElement, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import EducationMultiSelect from '@/shared/components/EducationMultiSelect/EducationMultiSelect';
import { selectAllProjectRolesList } from '@/redux/projectRolesList/projectRolesListSlice';
import Button from '@/shared/components/Button/Button';
import styles from './UsersFiltersForm.module.scss';
import { projectsCountOptions } from '@/shared/constants/projects-count-options';
import { useUsersFilters } from '@/hooks/useUsersFilters';
import { arraysEqualUnordered } from '@/shared/utils/arrayEqualUnordered';
import ActiveUsersFilters from './ActiveUsersFilters/ActiveUsersFilters';
import { useAppSelector } from '@/hooks/reduxHooks';
import { SelectOptionsInterface } from '../../../../shared/interfaces/select-options.interface';
import Dropdown from '../../../../shared/components/Dropdown/Dropdown';

interface FormData {
  specializationIds: string[];
  activeProjectsCount: number | null;
}

export default function UsersFiltersForm(): ReactElement {
  const specializationsList = useAppSelector(selectAllProjectRolesList);
  const { filters, updateFilters } = useUsersFilters();

  const form = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      specializationIds: [],
      activeProjectsCount: null,
    },
  });
  const watchedValues = form.watch();

  const isFiltersChanged =
    !arraysEqualUnordered(
      watchedValues.specializationIds ?? [],
      filters.specializationIds ?? [],
    ) ||
    watchedValues.activeProjectsCount !== (filters.activeProjectsCount ?? null);

  useEffect(() => {
    form.reset({
      specializationIds: filters.specializationIds ?? [],
      activeProjectsCount: filters.activeProjectsCount ?? null,
    });
  }, [filters, form.reset]);

  const onSubmit = (data: FormData): void => {
    updateFilters({
      specializationIds: data.specializationIds,
      activeProjectsCount: data.activeProjectsCount,
      page: 1,
    });
  };

  return (
    <div className={styles['users-filters-form']}>
      <form
        className={styles['users-filters-form__form']}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Controller
          name="specializationIds"
          control={form.control}
          render={({ field }) => (
            <EducationMultiSelect
              {...field}
              options={specializationsList}
              label="Список спеціалізацій:"
              placeholder="Всі"
            />
          )}
        />
        <Controller
          name="activeProjectsCount"
          control={form.control}
          render={({ field }) => (
            <Dropdown<SelectOptionsInterface>
              {...field}
              options={projectsCountOptions}
              label="Кількість активних проєктів:"
              placeholder="Всі"
              getOptionLabel={(o) => o.label}
              getOptionValue={(o) => o.value}
            />
          )}
        />
        <Button color="green" type="submit" disabled={!isFiltersChanged}>
          Застосувати
        </Button>
      </form>
      {(watchedValues.activeProjectsCount !== null ||
        !!watchedValues.specializationIds.length) && (
        <ActiveUsersFilters
          form={form}
          specializationsList={specializationsList}
        />
      )}
    </div>
  );
}
