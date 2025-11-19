'use client';

import React, { ReactElement, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/shared/components/Input/Input';
import Button from '@/shared/components/Button/Button';
import styles from './UserNameForm.module.scss';
import { useUpdateUserMutation } from '@/api/authApi';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import { useToast } from '@/hooks/useToast';
import {
  userNameSchema,
  userNameSchemaStatic,
} from '@/shared/forms/schemas/userNameSchema';
import { normalizeApostrophes } from '@/shared/utils/normalizeApostrophes';
import { useGetProjectRolesListQuery } from '@/api/projectRolesApi';
import MultiSelectWithChips from '@/shared/components/MultiSelectWithChips/MultiSelectWithChips';
import { useTranslations } from 'next-intl';

type FormData = z.infer<typeof userNameSchemaStatic>;

interface UserNameFormProps {
  onCancel: () => void;
  initialValues: AuthInterface;
}

export default function UserNameForm(props: UserNameFormProps): ReactElement {
  const { data: rolesList = [] } = useGetProjectRolesListQuery(undefined);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const { onCancel, initialValues } = props;
  const tForms = useTranslations('forms');
  const tButtons = useTranslations('buttons');
  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userNameSchema(tForms)),
    mode: 'onChange',
    defaultValues: {
      firstName: initialValues.firstName,
      lastName: initialValues.lastName,
      desiredRolesIds: initialValues.desiredRoles.map((role) => role.id),
    },
  });
  const { showToast, isActive } = useToast();

  useEffect(() => {
    setFocus('firstName');
  }, [setFocus]);

  const onSubmit = async (data: FormData): Promise<void> => {
    if (isActive('user name')) {
      return;
    }

    const result = await updateUser(data);
    if ('error' in result) {
      showToast({
        severity: 'error',
        summary: `${tForms('userNameForm.error')}`,
        life: 3000,
        actionKey: 'user name',
      });
      return;
    }
    if ('data' in result) {
      showToast({
        severity: 'success',
        summary: `${tForms('userNameForm.success')}`,
        life: 3000,
        actionKey: 'user name',
      });
      onCancel();
    }
  };

  return (
    <form
      className={styles['user-name-form']}
      onSubmit={handleSubmit(onSubmit)}
    >
      <fieldset
        className={styles['user-name-form__fieldset']}
        disabled={isLoading}
      >
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <Input
              label={tForms('userNameForm.firstName')}
              placeholder={tForms('userNameForm.placeholders.firstName')}
              {...field}
              value={field.value ?? ''}
              onChange={(e) => {
                const normalized = normalizeApostrophes(e.target.value);
                field.onChange(normalized);
              }}
              withError
              errorMessages={
                errors.firstName?.message && [errors.firstName.message]
              }
            />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <Input
              label={tForms('userNameForm.lastName')}
              placeholder={tForms('userNameForm.placeholders.lastName')}
              {...field}
              value={field.value ?? ''}
              onChange={(e) => {
                const normalized = normalizeApostrophes(e.target.value);
                field.onChange(normalized);
              }}
              withError
              errorMessages={
                errors.lastName?.message && [errors.lastName.message]
              }
            />
          )}
        />
        <Controller
          name="desiredRolesIds"
          control={control}
          render={({ field }) => (
            <MultiSelectWithChips
              {...field}
              label={tForms('userNameForm.desiredRoles')}
              placeholder={tForms('userNameForm.placeholders.desiredRoles')}
              options={rolesList}
              getOptionLabel={(o) => o.roleName}
              getOptionValue={(o) => o.id}
              withError
              errorMessages={
                errors.desiredRolesIds?.message && [
                  errors.desiredRolesIds.message,
                ]
              }
            />
          )}
        />
      </fieldset>
      <div className={styles['user-name-form__actions']}>
        <Button
          type="button"
          variant="secondary-frame"
          color="green"
          onClick={onCancel}
        >
          {tButtons('cancel')}
        </Button>
        <Button type="submit" color="green" loading={isLoading}>
          {tButtons('save')}
        </Button>
      </div>
    </form>
  );
}
