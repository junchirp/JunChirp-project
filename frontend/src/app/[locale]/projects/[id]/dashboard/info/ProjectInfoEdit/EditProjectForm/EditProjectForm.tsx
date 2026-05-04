'use client';

import { ReactElement, useEffect } from 'react';
import styles from './EditProjectForm.module.scss';
import {
  useGetCategoriesQuery,
  useUpdateProjectMutation,
} from '@/api/projectsApi';
import { z } from 'zod';
import {
  projectSchema,
  projectSchemaStatic,
} from '@/shared/forms/schemas/projectSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetProjectRolesListQuery } from '@/api/projectRolesApi';
import { useToast } from '@/hooks/useToast';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import ProjectFormFields from '@/shared/components/ProjectFormFields/ProjectFormFields';
import { ProjectInterface } from '@/shared/interfaces/project.interface';

type FormData = z.infer<typeof projectSchemaStatic>;

interface EditProjectFormProps {
  project: ProjectInterface;
}

export default function EditProjectForm({
  project,
}: EditProjectFormProps): ReactElement {
  const { data: categories = [] } = useGetCategoriesQuery(undefined);
  const { data: roles = [] } = useGetProjectRolesListQuery(undefined);
  const tForms = useTranslations('forms');
  const form = useForm<FormData>({
    resolver: zodResolver(projectSchema(tForms)),
    mode: 'onChange',
    defaultValues: {
      projectName: '',
      description: '',
      categoryId: '',
      rolesIds: [],
    },
  });

  useEffect(() => {
    form.reset({
      projectName: project.projectName,
      description: project.description,
      categoryId: project.category.id,
      rolesIds: [],
    });
  }, [project, form]);

  const [updateProject, { isLoading }] = useUpdateProjectMutation();
  const { showToast, isActive } = useToast();
  const router = useRouter();

  const onSubmit = async (data: FormData): Promise<void> => {
    if (isActive(ToastKeysEnum.NEW_PROJECT)) {
      return;
    }

    try {
      const newProject = await updateProject({ id: project.id, data }).unwrap();
      showToast({
        severity: 'success',
        summary: tForms('projectForm.updateSuccess'),
        life: 3000,
        actionKey: ToastKeysEnum.NEW_PROJECT,
      });

      router.replace(`/projects/${newProject.id}/dashboard/info`);
    } catch {
      showToast({
        severity: 'error',
        summary: tForms('projectForm.updateError'),
        life: 3000,
        actionKey: ToastKeysEnum.NEW_PROJECT,
      });
    }
  };

  return (
    <form
      className={styles['edit-project-form']}
      onSubmit={form.handleSubmit(onSubmit)}
      id="edit-project"
    >
      <ProjectFormFields
        form={form}
        roles={roles}
        categories={categories}
        tForms={tForms}
        disabled={isLoading}
        project={project}
      />
    </form>
  );
}
