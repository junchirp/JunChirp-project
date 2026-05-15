'use client';

import React, { ReactElement } from 'react';
import styles from './ProjectFormFields.module.scss';
import { Controller, UseFormReturn } from 'react-hook-form';
import Input from '@/shared/components/Input/Input';
import { normalizeApostrophes } from '@/shared/utils/normalizeApostrophes';
import Textarea from '@/shared/components/Textarea/Textarea';
import Dropdown from '@/shared/components/Dropdown/Dropdown';
import { ProjectCategoryInterface } from '@/shared/interfaces/project-category.interface';
import CheckboxChecked from '@/assets/icons/checkbox-checked.svg';
import CheckboxCheckedDisabled from '@/assets/icons/checkbox-checked-disbaled.svg';
import Checkbox from '@/assets/icons/checkbox-empty.svg';
import { z } from 'zod';
import { projectSchemaStatic } from '@/shared/forms/schemas/projectSchema';
import { ProjectRoleTypeInterface } from '@/shared/interfaces/project-role-type.interface';
import { ProjectInterface } from '@/shared/interfaces/project.interface';
import { useSystemLocale } from '@/hooks/useSystemLocale';

type FormData = z.infer<typeof projectSchemaStatic>;

interface ProjectFormFieldsProps {
  form: UseFormReturn<FormData>;
  roles: ProjectRoleTypeInterface[];
  categories: ProjectCategoryInterface[];
  project?: ProjectInterface;
  tForms: (key: string) => string;
  disabled: boolean;
}

export default function ProjectFormFields(
  props: ProjectFormFieldsProps,
): ReactElement {
  const { form, roles, categories, project, tForms, disabled } = props;
  const {
    control,
    formState: { errors },
  } = form;
  const existingRoleIds = new Set(
    project?.roles.map((r) => r.roleType.id) ?? [],
  );
  const locale = useSystemLocale();

  return (
    <fieldset className={styles['project-form-fields']} disabled={disabled}>
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
              const normalized = normalizeApostrophes(e.target.value);
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
          <div className={styles['project-form-fields__list-wrapper']}>
            <p className={styles['project-form-fields__list-label']}>
              {tForms('projectForm.roles')}
            </p>
            <div className={styles['project-form-fields__list']}>
              {roles.map((option) => {
                const isExisting = existingRoleIds.has(option.id);
                const isAdded = field.value.includes(option.id);
                const checked = isExisting || isAdded;
                return (
                  <div
                    className={styles['project-form-fields__checkbox-wrapper']}
                    key={option.id}
                  >
                    <label
                      htmlFor={option.id}
                      className={`
                        ${styles['project-form-fields__label']}
                        ${isExisting ? styles['project-form-fields__label--disabled'] : ''}
                      `}
                    >
                      {isExisting ? (
                        <CheckboxCheckedDisabled
                          className={styles['project-form-fields__icon']}
                        />
                      ) : checked ? (
                        <CheckboxChecked
                          className={styles['project-form-fields__icon']}
                        />
                      ) : (
                        <Checkbox
                          className={styles['project-form-fields__icon']}
                        />
                      )}
                      <p className={styles['project-form-fields__label-text']}>
                        {option.roleName}
                      </p>
                    </label>
                    <input
                      id={option.id}
                      type="checkbox"
                      className={styles['project-form-fields__checkbox']}
                      checked={checked}
                      disabled={isExisting}
                      onChange={(e) => {
                        if (isExisting) {
                          return;
                        }
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
  );
}
