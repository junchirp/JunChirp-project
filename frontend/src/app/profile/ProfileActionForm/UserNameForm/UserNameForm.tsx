'use client';

import React, { ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/shared/components/Input/Input';
import Button from '@/shared/components/Button/Button';
import styles from './UserNameForm.module.scss';
import { useUpdateUserMutation } from '@/api/authApi';
import { UserInterface } from '@/shared/interfaces/user.interface';
import { useToast } from '../../../../hooks/useToast';
import { userNameSchema } from '../../../../shared/forms/schemas/userNameSchema';
import { normalizeApostrophes } from '../../../../shared/utils/normalizeApostrophes';

type FormData = z.infer<typeof userNameSchema>;

interface UserNameFormProps {
  onCancel: () => void;
  initialValues: UserInterface;
}

export default function UserNameForm(props: UserNameFormProps): ReactElement {
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const { onCancel, initialValues } = props;
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(userNameSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: initialValues.firstName,
      lastName: initialValues.lastName,
    },
  });
  const { showToast, isActive } = useToast();

  const onSubmit = async (data: FormData): Promise<void> => {
    if (isActive('user name')) {
      return;
    }

    const result = await updateUser(data);
    if ('error' in result) {
      showToast({
        severity: 'error',
        summary: 'Помилка при оновленні імені та прізвища.',
        life: 3000,
        actionKey: 'user name',
      });
      return;
    }
    if ('data' in result) {
      showToast({
        severity: 'success',
        summary: `Ім'я та прізвище успішно оновлено.`,
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
              label="Ім'я"
              placeholder="Ім'я"
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
              label="Прізвище"
              placeholder="Прізвище"
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
      </fieldset>
      <div className={styles['user-name-form__actions']}>
        <Button
          type="button"
          variant="secondary-frame"
          color="green"
          onClick={onCancel}
        >
          Скасувати
        </Button>
        <Button type="submit" color="green" disabled={!isValid}>
          Зберегти
        </Button>
      </div>
    </form>
  );
}
