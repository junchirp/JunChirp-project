import { ReactElement, useEffect } from 'react';
import styles from './ProjectsFiltersForm.module.scss';
import { Controller, useForm } from 'react-hook-form';
import Button from '../../../../shared/components/Button/Button';
import { useProjectsFilters } from '../../../../hooks/useProjectsFilters';
import { useGetCategoriesQuery } from '../../../../api/projectsApi';
import CategoryDropdown from '../../../../shared/components/CategoryDropdown/CategoryDropdown';
import ProjectsStatusDropdown from '../../../../shared/components/ProjectStatusDropdown/ProjectStatusDropdown';
import { projectStatusOptions } from '../../../../shared/constants/project-status-options';
import { projectParticipantsOptions } from '../../../../shared/constants/project-participants-options';
import ProjectParticipantsDropdown from '../../../../shared/components/ProjectParticipantsDropdown/ProjectParticipantsDropdown';

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

  const onSubmit = (formData: FormData): void => {
    updateFilters({
      status: formData.status,
      categoryId: formData.categoryId,
      minParticipants: formData.participantsRange.minParticipants,
      maxParticipants: formData.participantsRange.maxParticipants,
      page: 1,
    });
  };

  return (
    <div className={styles['projects-filters-form']}>
      <form
        className={styles['projects-filters-form__form']}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Controller
          name="categoryId"
          control={form.control}
          render={({ field }) => (
            <CategoryDropdown
              {...field}
              options={categories}
              label="Категорія проєкту:"
              placeholder="Всі"
            />
          )}
        />
        <Controller
          name="status"
          control={form.control}
          render={({ field }) => (
            <ProjectsStatusDropdown
              {...field}
              options={projectStatusOptions}
              label="Статус проєкту:"
              placeholder="Всі"
            />
          )}
        />
        <Controller
          name="participantsRange"
          control={form.control}
          render={({ field }) => (
            <ProjectParticipantsDropdown
              {...field}
              options={projectParticipantsOptions}
              label="Кількість учасників:"
              placeholder="Всі"
            />
          )}
        />
        <Button color="green" type="submit" disabled={!isFiltersChanged}>
          Застосувати фільтр
        </Button>
      </form>
    </div>
  );
}
