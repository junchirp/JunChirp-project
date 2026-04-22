'use client';

import React, { ReactElement, useState } from 'react';
import styles from './ProjectForm.module.scss';
import Button from '@/shared/components/Button/Button';
import Input from '@/shared/components/Input/Input';
import Textarea from '@/shared/components/Textarea/Textarea';
import {
  useCreateProjectMutation,
  useGetCategoriesQuery,
} from '@/api/projectsApi';
import { ProjectCategoryInterface } from '@/shared/interfaces/project-category.interface';
import Dropdown from '@/shared/components/Dropdown/Dropdown';
import { z } from 'zod';
import {
  projectSchema,
  projectSchemaStatic,
} from '@/shared/forms/schemas/projectSchema';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetProjectRolesListQuery } from '@/api/projectRolesApi';
import CheckboxChecked from '@/assets/icons/checkbox-checked.svg';
import Checkbox from '@/assets/icons/checkbox-empty.svg';
import { useToast } from '@/hooks/useToast';
import { Locale, useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { normalizeApostrophes } from '@/shared/utils/normalizeApostrophes';
import CancelCreateProjectPopup from './CancelCreateProjectPopup/CancelCreateProjectPopup';

type FormData = z.infer<typeof projectSchemaStatic>;

export default function ProjectForm(): ReactElement {
  const { data: categories = [] } = useGetCategoriesQuery(undefined);
  const { data: roles = [] } = useGetProjectRolesListQuery(undefined);
  const tForms = useTranslations('forms');
  const tButtons = useTranslations('buttons');
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(projectSchema(tForms)),
    mode: 'onChange',
    defaultValues: {
      categoryId: '',
      rolesIds: [],
    },
  });
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const { showToast, isActive } = useToast();
  const router = useRouter();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const closeForm = (): void => {
    router.replace('/projects');
  };

  const openPopap = (): void => setIsOpen(true);
  const closePopap = (): void => setIsOpen(false);

  const onSubmit = async (data: FormData): Promise<void> => {
    if (isActive(ToastKeysEnum.NEW_PROJECT)) {
      return;
    }

    try {
      const project = await createProject(data).unwrap();
      showToast({
        severity: 'success',
        summary: tForms('projectForm.success'),
        life: 3000,
        actionKey: ToastKeysEnum.NEW_PROJECT,
      });

      router.replace(`/projects/${project.id}`);
    } catch {
      showToast({
        severity: 'error',
        summary: tForms('projectForm.error'),
        life: 3000,
        actionKey: ToastKeysEnum.NEW_PROJECT,
      });
    }
  };

  return (
    <>
      <form
        className={styles['project-form']}
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset
          className={styles['project-form__fields']}
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
                errorMessages={
                  errors.projectName?.message && [errors.projectName.message]
                }
                {...register('projectName')}
                {...field}
                value={field.value ?? ''}
                onChange={(e) => {
                  const normalized = normalizeApostrophes(e.target.value);
                  field.onChange(normalized);
                }}
              />
            )}
          />
          <Controller
            name="projectName"
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
                errorMessages={
                  errors.description?.message && [errors.description.message]
                }
                {...field}
                value={field.value ?? ''}
                onChange={(e) => {
                  const normalized = normalizeApostrophes(e.target.value);
                  field.onChange(normalized);
                }}
              />
            )}
          />
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Dropdown<ProjectCategoryInterface>
                options={categories}
                label={tForms('projectForm.category')}
                labelSize={20}
                labelHeight={1.4}
                labelWeight={600}
                labelMargin={12}
                placeholder={tForms('projectForm.placeholders.category')}
                {...field}
                getOptionLabel={(o) => o.categoryName[locale as Locale]}
                getOptionValue={(o) => o.id}
                withError
                errorMessages={
                  errors.categoryId?.message && [errors.categoryId.message]
                }
              />
            )}
          />
          <Controller
            name="rolesIds"
            control={control}
            render={({ field }) => (
              <div className={styles['project-form__list-wrapper']}>
                <p className={styles['project-form__list-label']}>
                  {tForms('projectForm.roles')}
                </p>
                <div className={styles['project-form__list']}>
                  {roles.map((option) => {
                    const checked = field.value.includes(option.id);
                    return (
                      <div
                        className={styles['project-form__checkbox-wrapper']}
                        key={option.id}
                      >
                        <label
                          htmlFor={option.id}
                          className={styles['project-form__label']}
                        >
                          {checked ? (
                            <CheckboxChecked
                              className={styles['project-form__icon']}
                            />
                          ) : (
                            <Checkbox
                              className={styles['project-form__icon']}
                            />
                          )}
                          <p className={styles['project-form__label-text']}>
                            {option.roleName}
                          </p>
                        </label>
                        <input
                          type="checkbox"
                          id={option.id}
                          className={styles['project-form__checkbox']}
                          value={option.id}
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
        <div className={styles['project-form__actions']}>
          <Button variant="secondary-frame" color="green" onClick={openPopap}>
            {tButtons('cancel')}
          </Button>
          <Button color="green" type="submit" loading={isLoading}>
            {tButtons('save')}
          </Button>
        </div>
      </form>
      <CancelCreateProjectPopup
        isOpen={isOpen}
        onCancel={closePopap}
        onConfirm={closeForm}
      />
    </>
  );
}
