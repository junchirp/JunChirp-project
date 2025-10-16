'use client';

import { useEffect, ReactElement, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/shared/components/Input/Input';
import Button from '@/shared/components/Button/Button';
import SocialAutocomplete from '@/shared/components/SocialAutocomplete/SocialAutocomplete';
import styles from './SocialForm.module.scss';
import { socialNetworks } from '@/shared/constants/social-networks';
import {
  ClientSocialInterface,
  SocialInterface,
} from '@/shared/interfaces/social.interface';
import {
  useAddSocialMutation,
  useUpdateSocialMutation,
} from '@/api/socialsApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useToast } from '@/hooks/useToast';
import { socialSchema } from '@/shared/forms/schemas/socialSchema';

type FormData = z.infer<typeof socialSchema>;

interface SocialFormProps {
  initialValues?: SocialInterface;
  onCancel: () => void;
}

export default function SocialForm(props: SocialFormProps): ReactElement {
  const [updateSocial, { isLoading: updateSocialLoading }] =
    useUpdateSocialMutation();
  const [addSocial, { isLoading: addSocialLoading }] = useAddSocialMutation();
  const { showToast, isActive } = useToast();
  const { initialValues, onCancel } = props;
  const [urlPlaceholder, setUrlPlaceholder] = useState('Посилання');
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(socialSchema),
    mode: 'onChange',
    defaultValues: {
      network: '',
      url: '',
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        network: initialValues.network,
        url: initialValues.url,
      });
    } else {
      reset({
        network: '',
        url: '',
      });
    }
  }, [initialValues, reset]);

  useEffect(() => {
    const subscription = watch((_, { name }) => {
      if (name === 'network') {
        trigger('url');
      }
    });
    return (): void => subscription.unsubscribe();
  }, [watch, trigger]);

  const onSubmit = async (data: FormData): Promise<void> => {
    if (isActive('social')) {
      return;
    }

    if (initialValues) {
      const result = await updateSocial({ id: initialValues.id, data });

      if ('error' in result) {
        const errorData = result.error as
          | ((FetchBaseQueryError | SerializedError) & {
              status: number;
            })
          | undefined;
        const status = errorData?.status;

        if (status === 409) {
          showToast({
            severity: 'error',
            summary: 'Ця соцмережа вже додана.',
            life: 3000,
            actionKey: 'social',
          });
          return;
        }
        return;
      }
    } else {
      const result = await addSocial(data);

      if ('error' in result) {
        const errorData = result.error as
          | ((FetchBaseQueryError | SerializedError) & {
              status: number;
            })
          | undefined;
        const status = errorData?.status;

        if (status === 409) {
          showToast({
            severity: 'error',
            summary: 'Ця соцмережа вже додана.',
            life: 3000,
            actionKey: 'social',
          });
          return;
        }
        return;
      }
    }
    onCancel();
  };

  const handleSelectSocial = (match: ClientSocialInterface | null): void => {
    if (match) {
      setUrlPlaceholder(match.url);
    } else {
      setUrlPlaceholder('Посилання');
    }
  };

  return (
    <form className={styles['social-form']} onSubmit={handleSubmit(onSubmit)}>
      <fieldset
        className={styles['social-form__fieldset']}
        disabled={updateSocialLoading || addSocialLoading}
      >
        <Controller
          name="network"
          control={control}
          render={({ field }) => (
            <SocialAutocomplete
              {...field}
              label="Назва соцмережі"
              placeholder="Вкажи назву соцмережі"
              suggestions={socialNetworks}
              onSelectSocial={handleSelectSocial}
              errorMessages={
                errors.network?.message && [errors.network.message]
              }
              withError
            />
          )}
        />
        <Input
          {...register('url')}
          label="Посилання"
          placeholder={urlPlaceholder}
          withError
          errorMessages={errors.url?.message && [errors.url.message]}
        />
      </fieldset>

      {initialValues ? (
        <div className={styles['social-form__actions']}>
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
      ) : (
        <Button type="submit" fullWidth color="green" disabled={!isValid}>
          Зберегти
        </Button>
      )}
    </form>
  );
}
