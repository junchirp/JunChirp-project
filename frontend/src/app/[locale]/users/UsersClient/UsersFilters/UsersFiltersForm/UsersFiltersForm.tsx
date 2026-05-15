'use client';

import { ReactElement, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import MultiSelect from '@/shared/components/MultiSelect/MultiSelect';
import Button from '@/shared/components/Button/Button';
import styles from './UsersFiltersForm.module.scss';
import { projectsCountOptions } from '@/shared/constants/projects-count-options';
import { useUsersFilters } from '@/hooks/useUsersFilters';
import { arraysEqualUnordered } from '@/shared/utils/arrayEqualUnordered';
import ActiveUsersFilters from './ActiveUsersFilters/ActiveUsersFilters';
import { SelectOptionsInterface } from '@/shared/interfaces/select-options.interface';
import Dropdown from '@/shared/components/Dropdown/Dropdown';
import { useGetProjectRolesListQuery } from '@/api/projectRolesApi';

interface FormData {
  desiredRolesIds: string[];
  activeProjectsCount: number | null;
}

export default function UsersFiltersForm(): ReactElement {
  const { data: rolesList = [] } = useGetProjectRolesListQuery(undefined);
  const { filters, updateFilters } = useUsersFilters();

  const form = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      desiredRolesIds: [],
      activeProjectsCount: null,
    },
  });
  const watchedValues = form.watch();

  const isFiltersChanged =
    !arraysEqualUnordered(
      watchedValues.desiredRolesIds ?? [],
      filters.desiredRolesIds ?? [],
    ) ||
    watchedValues.activeProjectsCount !== (filters.activeProjectsCount ?? null);

  useEffect(() => {
    form.reset({
      desiredRolesIds: filters.desiredRolesIds ?? [],
      activeProjectsCount: filters.activeProjectsCount ?? null,
    });
  }, [filters, form.reset]);

  const onSubmit = (data: FormData): void => {
    updateFilters({
      desiredRolesIds: data.desiredRolesIds,
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
          name="desiredRolesIds"
          control={form.control}
          render={({ field }) => (
            <MultiSelect
              {...field}
              options={rolesList}
              label="Список спеціалізацій:"
              labelSize={20}
              labelHeight={1.4}
              labelWeight={600}
              labelMargin={12}
              placeholder="Всі"
              placeholderColor="black"
              getOptionLabel={(o) => o.roleName}
              getOptionValue={(o) => o.id}
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
              labelSize={20}
              labelHeight={1.4}
              labelWeight={600}
              labelMargin={12}
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
        !!watchedValues.desiredRolesIds.length) && (
        <ActiveUsersFilters form={form} rolesList={rolesList} />
      )}
    </div>
  );
}
