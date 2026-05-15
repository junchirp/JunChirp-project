'use client';

import { ReactElement, useState } from 'react';
import styles from './NewProjectForm.module.scss';
import Button from '@/shared/components/Button/Button';
import {
  useCreateProjectMutation,
  useGetCategoriesQuery,
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
import CancelCreateProjectPopup from './CancelCreateProjectPopup/CancelCreateProjectPopup';
import ProjectFormFields from '@/shared/components/ProjectFormFields/ProjectFormFields';

type FormData = z.infer<typeof projectSchemaStatic>;

export default function NewProjectForm(): ReactElement {
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: roles = [] } = useGetProjectRolesListQuery();
  const tForms = useTranslations('forms');
  const tButtons = useTranslations('buttons');
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
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const { showToast, isActive } = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const closeForm = (): void => {
    router.replace('/projects');
  };

  const openPopup = (): void => setIsOpen(true);
  const closePopup = (): void => setIsOpen(false);

  const onSubmit = async (data: FormData): Promise<void> => {
    if (isActive(ToastKeysEnum.NEW_PROJECT)) {
      return;
    }

    try {
      const newProject = await createProject(data).unwrap();
      showToast({
        severity: 'success',
        summary: tForms('projectForm.createSuccess'),
        life: 3000,
        actionKey: ToastKeysEnum.NEW_PROJECT,
      });

      router.replace(`/projects/${newProject.id}`);
    } catch {
      showToast({
        severity: 'error',
        summary: tForms('projectForm.createError'),
        life: 3000,
        actionKey: ToastKeysEnum.NEW_PROJECT,
      });
    }
  };

  return (
    <>
      <form
        className={styles['new-project-form']}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <ProjectFormFields
          form={form}
          roles={roles}
          categories={categories}
          tForms={tForms}
          disabled={isLoading}
        />
        <div className={styles['new-project-form__actions']}>
          <Button variant="secondary-frame" color="green" onClick={openPopup}>
            {tButtons('cancel')}
          </Button>
          <Button color="green" type="submit" loading={isLoading}>
            {tButtons('save')}
          </Button>
        </div>
      </form>
      <CancelCreateProjectPopup
        isOpen={isOpen}
        onCancel={closePopup}
        onConfirm={closeForm}
      />
    </>
  );
}
