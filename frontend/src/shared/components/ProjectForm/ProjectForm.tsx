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
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import DiscordBanner from '@/shared/components/DiscordBanner/DiscordBanner';
import { useLocale, useTranslations } from 'next-intl';
import { Locale } from '@/i18n/routing';

type FormData = z.infer<typeof projectSchemaStatic>;

export default function ProjectForm(): ReactElement {
  const { data: categories = [] } = useGetCategoriesQuery(undefined);
  const { data: roles = [] } = useGetProjectRolesListQuery(undefined);
  const t = useTranslations('forms');
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(projectSchema(t)),
    mode: 'onChange',
    defaultValues: {
      categoryId: '',
      rolesIds: [],
    },
  });
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const { showToast, isActive } = useToast();
  const router = useRouter();
  const [isBanner, setBanner] = useState(false);
  const user = useAppSelector(authSelector.selectUser);
  const locale = useLocale();

  const closeBanner = (): void => {
    setBanner(false);
  };

  const closeForm = (): void => {
    router.replace('/projects');
  };

  const onSubmit = async (data: FormData): Promise<void> => {
    if (!user?.discordId) {
      setBanner(true);
      return;
    }

    if (isActive('project')) {
      return;
    }

    const result = await createProject(data);
    if ('error' in result) {
      showToast({
        severity: 'error',
        summary: 'Не вдалося створити проєкт.',
        detail: 'Досягнуто ліміту активних проєктів.',
        life: 3000,
        actionKey: 'project',
      });
      return;
    }

    if ('data' in result) {
      showToast({
        severity: 'success',
        summary: 'Проєкт успішно створено!',
        life: 3000,
        actionKey: 'project',
      });

      const projectId = result.data.id;
      router.replace(`/projects/${projectId}`);
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
          <Input
            label="Назва проєкту"
            labelSize={20}
            labelHeight={1.4}
            labelWeight={600}
            labelMargin={12}
            placeholder="Введи назву проєкту"
            withError
            errorMessages={
              errors.projectName?.message && [errors.projectName.message]
            }
            {...register('projectName')}
          />
          <Textarea
            label="Короткий опис проєкту"
            labelSize={20}
            labelHeight={1.4}
            labelWeight={600}
            labelMargin={12}
            placeholder="Коротко опиши ідею, мету та цінність проєкту"
            withError
            errorMessages={
              errors.description?.message && [errors.description.message]
            }
            {...register('description')}
          />
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Dropdown<ProjectCategoryInterface>
                options={categories}
                label="Категорія проєкту"
                labelSize={20}
                labelHeight={1.4}
                labelWeight={600}
                labelMargin={12}
                placeholder="Будь ласка, вибери категорію проєкту"
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
                  Обери необхідні ролі для проєкту
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
          <Button variant="secondary-frame" color="green" onClick={closeForm}>
            Скасувати
          </Button>
          <Button color="green" type="submit" loading={isLoading}>
            Зберегти
          </Button>
        </div>
      </form>
      {isBanner && (
        <DiscordBanner
          closeBanner={closeBanner}
          message="Щоб створити проєкт, підключи свій Discord. Це потрібно для створення чату проєкту."
          isCancelButton
          withWrapper
        />
      )}
    </>
  );
}
