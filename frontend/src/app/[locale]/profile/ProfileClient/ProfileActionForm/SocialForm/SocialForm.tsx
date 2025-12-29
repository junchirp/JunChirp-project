'use client';

import { useEffect, ReactElement } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/shared/components/Input/Input';
import Button from '@/shared/components/Button/Button';
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
import {
  socialSchema,
  socialSchemaStatic,
} from '@/shared/forms/schemas/socialSchema';
import Dropdown from '@/shared/components/Dropdown/Dropdown';
import { useTranslations } from 'next-intl';

type FormData = z.infer<typeof socialSchemaStatic>;

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
  const tForms = useTranslations('forms');
  const tButtons = useTranslations('buttons');
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(socialSchema(tForms)),
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

    let url = data.url.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }
    const preparedData = { ...data, url };

    if (initialValues) {
      const result = await updateSocial({
        id: initialValues.id,
        data: preparedData,
      });

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
            summary: tForms('socialForm.error409'),
            life: 3000,
            actionKey: 'social',
          });
        } else {
          showToast({
            severity: 'error',
            summary: tForms('socialForm.error'),
            life: 3000,
            actionKey: 'social',
          });
        }
        return;
      }

      if ('data' in result) {
        showToast({
          severity: 'success',
          summary: tForms('socialForm.success'),
          life: 3000,
          actionKey: 'social',
        });
        onCancel();
      }
    } else {
      const result = await addSocial(preparedData);

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
            summary: tForms('socialForm.error409'),
            life: 3000,
            actionKey: 'social',
          });
        } else {
          showToast({
            severity: 'error',
            summary: tForms('socialForm.error'),
            life: 3000,
            actionKey: 'social',
          });
        }
        return;
      }
      if ('data' in result) {
        showToast({
          severity: 'success',
          summary: tForms('socialForm.success'),
          life: 3000,
          actionKey: 'social',
        });
        onCancel();
      }
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
            <Dropdown<ClientSocialInterface>
              {...field}
              options={socialNetworks}
              label={tForms('socialForm.network')}
              placeholder={tForms('socialForm.placeholders.network')}
              getOptionLabel={(o) => o.network}
              getOptionValue={(o) => o.network}
              withError
              errorMessages={
                errors.network?.message && [errors.network.message]
              }
              autoFocus
            />
          )}
        />
        <Input
          {...register('url')}
          label={tForms('socialForm.url')}
          placeholder={tForms('socialForm.placeholders.url')}
          withError
          errorMessages={errors.url?.message && [errors.url.message]}
        />
      </fieldset>
      <div className={styles['social-form__actions']}>
        <Button
          type="button"
          variant="secondary-frame"
          color="green"
          onClick={onCancel}
        >
          {tButtons('cancel')}
        </Button>
        <Button
          type="submit"
          color="green"
          loading={updateSocialLoading || addSocialLoading}
        >
          {tButtons('save')}
        </Button>
      </div>
    </form>
  );
}
