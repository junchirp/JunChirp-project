'use client';

import React, { ReactElement, useEffect } from 'react';
import styles from './EditProjectForm.module.scss';
import {
  useGetCategoriesQuery,
  useUpdateProjectMutation,
} from '@/api/projectsApi';
import { z } from 'zod';
import {
  updateProjectSchema,
  updateProjectSchemaStatic,
} from '@/shared/forms/schemas/updateProjectSchema';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/useToast';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { ProjectInterface } from '@/shared/interfaces/project.interface';
import Input from '@/shared/components/Input/Input';
import { normalizeInputValue } from '@/shared/utils/normalizeInputValue';
import Textarea from '@/shared/components/Textarea/Textarea';
import Dropdown from '@/shared/components/Dropdown/Dropdown';
import { useShortLocale } from '@/hooks/useShortLocale';
import { isDiscordNotConnectedError } from '@/shared/utils/isDiscordNotConnectedError';
import { useDiscord } from '@/hooks/useDiscord';
import { isDiscordNotInGuildError } from '@/shared/utils/isDiscordNotInGuildError';

type FormData = z.infer<typeof updateProjectSchemaStatic>;

interface EditProjectFormProps {
  project: ProjectInterface;
}

export default function EditProjectForm({
  project,
}: EditProjectFormProps): ReactElement {
  const openDiscordConnect = useDiscord();
  const { data: categories = [] } = useGetCategoriesQuery();
  const tForms = useTranslations('forms');
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(updateProjectSchema(tForms)),
    mode: 'onChange',
    defaultValues: {
      projectName: '',
      description: '',
      categoryId: '',
    },
  });

  const locale = useShortLocale();

  useEffect(() => {
    reset({
      projectName: project.projectName,
      description: project.description,
      categoryId: project.category.id,
    });
  }, [project, reset]);

  const [updateProject, { isLoading }] = useUpdateProjectMutation();
  const { showToast, isActive } = useToast();
  const router = useRouter();

  const onSubmit = async (data: FormData): Promise<void> => {
    if (isActive(ToastKeysEnum.NEW_PROJECT)) {
      return;
    }

    try {
      const trimmedData = {
        ...data,
        projectName: data.projectName.trim(),
        description: data.description.trim(),
      };
      const newProject = await updateProject({
        id: project.id,
        data: trimmedData,
      }).unwrap();

      showToast({
        severity: 'success',
        summary: tForms('projectForm.updateSuccess'),
        life: 3000,
        actionKey: ToastKeysEnum.NEW_PROJECT,
      });

      router.replace(`/projects/${newProject.id}/dashboard/overview`);
    } catch (error) {
      if (isDiscordNotConnectedError(error)) {
        openDiscordConnect({
          withWrapper: false,
          isCancelButton: false,
          errorCode: 'DISCORD_NOT_CONNECTED',
        });
        return;
      }

      if (isDiscordNotInGuildError(error)) {
        openDiscordConnect({
          withWrapper: false,
          isCancelButton: false,
          errorCode: 'DISCORD_NOT_IN_GUILD',
        });
        return;
      }

      showToast({
        severity: 'error',
        summary: tForms('projectForm.updateError'),
        detail: tForms('projectForm.updateErrorDetails'),
        life: 3000,
        actionKey: ToastKeysEnum.NEW_PROJECT,
      });
    }
  };

  return (
    <form
      className={styles['edit-project-form']}
      onSubmit={handleSubmit(onSubmit)}
      id="edit-project"
    >
      <fieldset
        className={styles['edit-project-form__fields']}
        disabled={isLoading}
      >
        <Controller
          name="projectName"
          control={control}
          render={({ field }) => (
            <Input
              label={tForms('projectForm.projectName')}
              labelSize={20}
              labelHeight={1.4}
              labelWeight={600}
              labelMargin={12}
              placeholder={tForms('projectForm.placeholders.projectName')}
              withError
              errorMessage={errors.projectName?.message}
              {...field}
              onChange={(e) => {
                const normalized = normalizeInputValue(e.target.value);
                field.onChange(normalized);
              }}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              label={tForms('projectForm.description')}
              labelSize={20}
              labelHeight={1.4}
              labelWeight={600}
              labelMargin={12}
              placeholder={tForms('projectForm.placeholders.description')}
              withError
              errorMessage={errors.description?.message}
              {...field}
              onChange={(e) => {
                const normalized = normalizeInputValue(e.target.value);
                field.onChange(normalized);
              }}
            />
          )}
        />
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <Dropdown
              options={categories}
              label={tForms('projectForm.category')}
              labelSize={20}
              labelHeight={1.4}
              labelWeight={600}
              labelMargin={12}
              placeholder={tForms('projectForm.placeholders.category')}
              {...field}
              getOptionLabel={(o) => o.categoryName[locale]}
              getOptionValue={(o) => o.id}
              withError
              errorMessage={errors.categoryId?.message}
            />
          )}
        />
      </fieldset>
    </form>
  );
}
