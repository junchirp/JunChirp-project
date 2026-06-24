'use client';

import { ReactElement, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import MultiSelect from '@/shared/components/MultiSelect/MultiSelect';
import styles from './UsersFiltersForm.module.scss';
import { useUsersFilters } from '@/hooks/useUsersFilters';
import ActiveUsersFilters from './ActiveUsersFilters/ActiveUsersFilters';
import { SelectOptionsInterface } from '@/shared/interfaces/select-options.interface';
import Dropdown from '@/shared/components/Dropdown/Dropdown';
import { useGetProjectRolesListQuery } from '@/api/projectRolesApi';
import { useActiveProjectsOptions } from '@/hooks/useActiveProjectsOptions';
import { useTranslations } from 'next-intl';

interface FormData {
  desiredRolesIds: string[];
  activeProjectsCount: number | null;
}

export default function UsersFiltersForm(): ReactElement {
  const { data: rolesList = [] } = useGetProjectRolesListQuery();
  const { filters, updateFilters } = useUsersFilters();
  const projectsCountOptions = useActiveProjectsOptions();
  const t = useTranslations('usersPage');

  const form = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      desiredRolesIds: [],
      activeProjectsCount: null,
    },
  });
  const watchedValues = form.watch();

  useEffect(() => {
    form.reset({
      desiredRolesIds: filters.desiredRolesIds ?? [],
      activeProjectsCount: filters.activeProjectsCount ?? null,
    });
  }, [filters, form.reset]);

  return (
    <div className={styles['users-filters-form']}>
      <form className={styles['users-filters-form__form']}>
        <fieldset className={styles['users-filters-form__fieldset']}>
          <Controller
            name="desiredRolesIds"
            control={form.control}
            render={({ field }) => (
              <MultiSelect
                {...field}
                options={rolesList}
                label={`${t('role')}:`}
                labelSize={20}
                labelHeight={1.4}
                labelWeight={600}
                labelMargin={12}
                placeholder={t('all')}
                placeholderColor="black"
                getOptionLabel={(o) => o.roleName}
                getOptionValue={(o) => o.id}
                onChange={(value) => {
                  field.onChange(value);
                  updateFilters({
                    desiredRolesIds: value,
                    page: 1,
                  });
                }}
              />
            )}
          />
        </fieldset>
        <fieldset className={styles['users-filters-form__fieldset']}>
          <Controller
            name="activeProjectsCount"
            control={form.control}
            render={({ field }) => (
              <Dropdown<SelectOptionsInterface>
                {...field}
                options={projectsCountOptions}
                label={`${t('activeProjectsCount')}:`}
                labelSize={20}
                labelHeight={1.4}
                labelWeight={600}
                labelMargin={12}
                getOptionLabel={(o) => o.label}
                getOptionValue={(o) => o.value}
                onChange={(value) => {
                  field.onChange(value);
                  updateFilters({
                    activeProjectsCount: value,
                    page: 1,
                  });
                }}
              />
            )}
          />
        </fieldset>
      </form>
      {(watchedValues.activeProjectsCount !== null ||
        !!watchedValues.desiredRolesIds.length) && (
        <ActiveUsersFilters
          form={form}
          rolesList={rolesList}
          updateFilters={updateFilters}
        />
      )}
    </div>
  );
}
