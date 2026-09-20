'use client';

import React, { ReactElement, useState } from 'react';
import styles from './NewProjectForm.module.scss';
import Button from '@/shared/components/Button/Button';
import {
  useCreateProjectMutation,
  useGetCategoriesQuery,
} from '@/api/projectsApi';
import { z } from 'zod';
import {
  createProjectSchema,
  createProjectSchemaStatic,
} from '@/shared/forms/schemas/createProjectSchema';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetProjectRolesListQuery } from '@/api/projectRolesApi';
import { useToast } from '@/hooks/useToast';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import CancelCreateProjectPopup from './CancelCreateProjectPopup/CancelCreateProjectPopup';
import { useShortLocale } from '@/hooks/useShortLocale';
import Input from '@/shared/components/Input/Input';
import { normalizeInputValue } from '@/shared/utils/normalizeInputValue';
import Textarea from '@/shared/components/Textarea/Textarea';
import Dropdown from '@/shared/components/Dropdown/Dropdown';
import CheckboxChecked from '@/assets/icons/checkbox-checked.svg';
import Checkbox from '@/assets/icons/checkbox-empty.svg';
import { useDiscord } from '@/hooks/useDiscord';
import { isDiscordNotConnectedError } from '@/shared/utils/isDiscordNotConnectedError';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { isDiscordNotInGuildError } from '@/shared/utils/isDiscordNotInGuildError';

type FormData = z.infer<typeof createProjectSchemaStatic>;

export default function NewProjectForm(): ReactElement {
  const locale = useShortLocale();
  const openDiscordConnect = useDiscord();
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: roles = [] } = useGetProjectRolesListQuery();
  const tForms = useTranslations('forms');
  const tButtons = useTranslations('buttons');
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createProjectSchema(tForms)),
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
      const trimmedData = {
        ...data,
        projectName: data.projectName.trim(),
        description: data.description.trim(),
      };

      const newProject = await createProject({
        ...trimmedData,
        locale,
      }).unwrap();

      showToast({
        severity: 'success',
        summary: tForms('projectForm.createSuccess'),
        life: 3000,
        actionKey: ToastKeysEnum.NEW_PROJECT,
      });

      router.replace(`/projects/${newProject.id}/dashboard`);
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

      const err = error as FetchBaseQueryError;
      const status = err.status;

      if (status === 409) {
        showToast({
          severity: 'error',
          summary: tForms('projectForm.createError409'),
          life: 3000,
          actionKey: ToastKeysEnum.NEW_PROJECT,
        });
      } else {
        showToast({
          severity: 'error',
          summary: tForms('projectForm.createError'),
          detail: tForms('projectForm.createErrorDetails'),
          life: 3000,
          actionKey: ToastKeysEnum.NEW_PROJECT,
        });
      }
    }
  };

  return (
    <>
      <form
        className={styles['new-project-form']}
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset
          className={styles['new-project-form__fields']}
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
          <Controller
            name="rolesIds"
            control={control}
            render={({ field }) => (
              <div className={styles['new-project-form__list-wrapper']}>
                <p className={styles['new-project-form__list-label']}>
                  {tForms('projectForm.roles')}
                </p>
                <div className={styles['new-project-form__list']}>
                  {roles.map((option) => {
                    const checked = field.value.includes(option.id);
                    return (
                      <div
                        className={styles['new-project-form__checkbox-wrapper']}
                        key={option.id}
                      >
                        <label
                          htmlFor={option.id}
                          className={styles['new-project-form__label']}
                        >
                          {checked ? (
                            <CheckboxChecked
                              className={styles['new-project-form__icon']}
                            />
                          ) : (
                            <Checkbox
                              className={styles['new-project-form__icon']}
                            />
                          )}
                          <p className={styles['new-project-form__label-text']}>
                            {option.roleName}
                          </p>
                        </label>
                        <input
                          id={option.id}
                          type="checkbox"
                          className={styles['new-project-form__checkbox']}
                          checked={checked}
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? [...field.value, option.id]
                              : field.value.filter((id) => id !== option.id);
                            field.onChange(newValue);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          />
        </fieldset>
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
