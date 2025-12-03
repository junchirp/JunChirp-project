'use client';

import { ReactElement, useEffect } from 'react';
import styles from './ProjectsFiltersForm.module.scss';
import { Controller, useForm } from 'react-hook-form';
import Button from '@/shared/components/Button/Button';
import { useProjectsFilters } from '@/hooks/useProjectsFilters';
import { useGetCategoriesQuery } from '@/api/projectsApi';
import { projectStatusOptions } from '@/shared/constants/project-status-options';
import { projectParticipantsOptions } from '@/shared/constants/project-participants-options';
import Dropdown from '@/shared/components/Dropdown/Dropdown';
import { ProjectCategoryInterface } from '@/shared/interfaces/project-category.interface';
import { ParticipantsOptionsInterface } from '@/shared/interfaces/participants-options.interface';
import { SelectOptionsInterface } from '@/shared/interfaces/select-options.interface';

interface FormData {
  status: 'active' | 'done' | null;
  categoryId: string;
  participantsRange: { minParticipants: number; maxParticipants: number };
}

export default function ProjectsFiltersForm(): ReactElement {
  const { filters, updateFilters } = useProjectsFilters();
  const { data = [] } = useGetCategoriesQuery(undefined);
  const categories = [{ id: '', categoryName: 'Всі' }, ...data];

  const form = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      status: null,
      categoryId: '',
      participantsRange: { minParticipants: 0, maxParticipants: 0 },
    },
  });
  const watchedValues = form.watch();

  const isFiltersChanged =
    watchedValues.status !== (filters.status ?? null) ||
    watchedValues.categoryId !== (filters.categoryId ?? '') ||
    watchedValues.participantsRange.minParticipants !==
      (filters.minParticipants ?? 0) ||
    watchedValues.participantsRange.maxParticipants !==
      (filters.maxParticipants ?? 0);

  useEffect(() => {
    form.reset({
      status: filters.status ?? null,
      categoryId: filters.categoryId ?? '',
      participantsRange: {
        minParticipants: filters.minParticipants ?? 0,
        maxParticipants: filters.maxParticipants ?? 0,
      },
    });
  }, [filters, form.reset]);

  useEffect(() => {
    if (!isFiltersChanged) {
      return;
    }
    updateFilters({
      status: watchedValues.status,
      categoryId: watchedValues.categoryId,
      minParticipants: watchedValues.participantsRange.minParticipants,
      maxParticipants: watchedValues.participantsRange.maxParticipants,
      page: 1,
    });
  }, [watchedValues, isFiltersChanged, updateFilters]);

  return (
    <div className={styles['projects-filters-form']}>
      <form className={styles['projects-filters-form__form']}>
        <fieldset className={styles['projects-filters-form__fieldset']}>
          <Controller
            name="categoryId"
            control={form.control}
            render={({ field }) => (
              <Dropdown<ProjectCategoryInterface>
                {...field}
                options={categories}
                label="Категорія проєкту:"
                labelSize={20}
                labelHeight={1.4}
                labelWeight={600}
                labelMargin={12}
                placeholder="Всі"
                getOptionLabel={(o) => o.categoryName}
                getOptionValue={(o) => o.id}
              />
            )}
          />
        </fieldset>
        <fieldset className={styles['projects-filters-form__fieldset']}>
          <Controller
            name="status"
            control={form.control}
            render={({ field }) => (
              <Dropdown<SelectOptionsInterface>
                {...field}
                options={projectStatusOptions}
                label="Статус проєкту:"
                labelSize={20}
                labelHeight={1.4}
                labelWeight={600}
                labelMargin={12}
                placeholder="Всі"
                getOptionLabel={(o) => o.label}
                getOptionValue={(o) => o.value}
              />
            )}
          />
        </fieldset>
        <fieldset className={styles['projects-filters-form__fieldset']}>
          <Controller
            name="participantsRange"
            control={form.control}
            render={({ field }) => (
              <Dropdown<ParticipantsOptionsInterface>
                {...field}
                options={projectParticipantsOptions}
                label="Кількість учасників:"
                labelSize={20}
                labelHeight={1.4}
                labelWeight={600}
                labelMargin={12}
                placeholder="Всі"
                value={
                  field.value
                    ? `${field.value.minParticipants}-${field.value.maxParticipants}`
                    : null
                }
                getOptionLabel={(o) => o.label}
                getOptionValue={(o) => `${o.min}-${o.max}`}
                onChange={(val) => {
                  if (!val) {
                    field.onChange({ minParticipants: 0, maxParticipants: 0 });
                    return;
                  }
                  const [min, max] = val.split('-').map(Number);
                  field.onChange({
                    minParticipants: min,
                    maxParticipants: max,
                  });
                }}
              />
            )}
          />
        </fieldset>
      </form>
    </div>
  );
}
