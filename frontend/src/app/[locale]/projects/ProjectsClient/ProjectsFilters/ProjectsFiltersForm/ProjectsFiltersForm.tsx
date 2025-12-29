'use client';

import { ReactElement, useEffect } from 'react';
import styles from './ProjectsFiltersForm.module.scss';
import { Controller, useForm } from 'react-hook-form';
import { useProjectsFilters } from '../../../../../../hooks/useProjectsFilters';
import { useGetCategoriesQuery } from '../../../../../../api/projectsApi';
import Dropdown from '../../../../../../shared/components/Dropdown/Dropdown';
import { ProjectCategoryInterface } from '../../../../../../shared/interfaces/project-category.interface';
import { ParticipantsOptionsInterface } from '../../../../../../shared/interfaces/participants-options.interface';
import { SelectOptionsInterface } from '../../../../../../shared/interfaces/select-options.interface';
import { useLocale, useTranslations } from 'next-intl';
import { Locale } from '../../../../../../i18n/routing';
import { useProjectParticipantsOptions } from '../../../../../../hooks/useProjectParticipantsOptions';
import { useProjectStatusOptions } from '../../../../../../hooks/useProjectStatusOptions';

interface FormData {
  status: 'active' | 'done' | null;
  categoryId: string;
  participantsRange: { minParticipants: number; maxParticipants: number };
}

export default function ProjectsFiltersForm(): ReactElement {
  const { filters, updateFilters } = useProjectsFilters();
  const { data = [] } = useGetCategoriesQuery(undefined);
  const t = useTranslations('projectsPage');
  const locale = useLocale();
  const categories = [
    {
      id: '',
      categoryName: {
        [locale]: t('all'),
      } as Record<Locale, string>,
    },
    ...data,
  ];
  const participantsOptions = useProjectParticipantsOptions();
  const statusOptions = useProjectStatusOptions();

  const form = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      status: null,
      categoryId: '',
      participantsRange: { minParticipants: 0, maxParticipants: 0 },
    },
  });

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
                label={`${t('categoryId')}:`}
                labelSize={20}
                labelHeight={1.4}
                labelWeight={600}
                labelMargin={12}
                placeholder="Всі"
                getOptionLabel={(o) => o.categoryName[locale as Locale]}
                getOptionValue={(o) => o.id}
                onChange={(value) => {
                  field.onChange(value);
                  updateFilters({
                    categoryId: value,
                    page: 1,
                  });
                }}
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
                options={statusOptions}
                label={`${t('status')}:`}
                labelSize={20}
                labelHeight={1.4}
                labelWeight={600}
                labelMargin={12}
                placeholder="Всі"
                getOptionLabel={(o) => o.label}
                getOptionValue={(o) => o.value}
                onChange={(value) => {
                  field.onChange(value);
                  updateFilters({
                    status: value,
                    page: 1,
                  });
                }}
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
                options={participantsOptions}
                label={`${t('participantsRange')}:`}
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
                    updateFilters({
                      minParticipants: undefined,
                      maxParticipants: undefined,
                      page: 1,
                    });
                    return;
                  }

                  const [min, max] = val.split('-').map(Number);
                  field.onChange({
                    minParticipants: min,
                    maxParticipants: max,
                  });
                  updateFilters({
                    minParticipants: min,
                    maxParticipants: max,
                    page: 1,
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
