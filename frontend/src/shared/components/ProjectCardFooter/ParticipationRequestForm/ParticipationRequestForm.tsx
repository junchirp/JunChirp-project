'use client';

import { ReactElement, useState } from 'react';
import styles from './ParticipationRequestForm.module.scss';
import { Controller, useForm } from 'react-hook-form';
import RadioGroup from '@/shared/components/RadioGroup/RadioGroup';
import Button from '@/shared/components/Button/Button';
import { z } from 'zod';
import {
  requestSchema,
  requestSchemaStatic,
} from '@/shared/forms/schemas/requestSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProjectCardInterface } from '@/shared/interfaces/project-card.interface';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import { useLocale, useTranslations } from 'next-intl';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import DiscordBanner from '@/shared/components/DiscordBanner/DiscordBanner';
import { useToast } from '@/hooks/useToast';
import { useCreateRequestMutation } from '@/api/participationsApi';
import { ProjectRoleInterface } from '@/shared/interfaces/project-role.interface';
import { Locale } from '@/i18n/routing';

interface ParticipationRequestFormProps {
  project: ProjectCardInterface;
  user: AuthInterface;
  size: 'small' | 'large';
  vacantRoles: ProjectRoleInterface[];
  className?: string;
}

type FormData = z.infer<typeof requestSchemaStatic>;

export default function ParticipationRequestForm({
  project,
  user,
  size,
  vacantRoles,
  className,
}: ParticipationRequestFormProps): ReactElement {
  const tForm = useTranslations('forms');
  const tProjectsPage = useTranslations('projectsPage');
  const tButtons = useTranslations('buttons');
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormData>({
    resolver: zodResolver(requestSchema(tForm)),
    mode: 'onChange',
    defaultValues: {
      projectId: project.id,
      projectRoleId: '',
      userId: user.id,
    },
  });
  const [isRequestBanner, setRequestBanner] = useState(false);
  const { showToast, isActive } = useToast();
  const locale = useLocale();
  const [createRequest, { isLoading: requestLoading }] =
    useCreateRequestMutation();
  const roleTypeIds = user.desiredRoles.map((role) => role.id);
  const labelClassNames = [
    styles['participation-request-form__label'],
    size === 'small'
      ? styles['participation-request-form__label--small']
      : styles['participation-request-form__label--large'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const closeRequestBanner = (): void => setRequestBanner(false);

  const sendRequest = async (data: FormData): Promise<void> => {
    if (!user.discordId) {
      setRequestBanner(true);
      return;
    }

    if (isActive(ToastKeysEnum.PARTICIPATION_REQUEST)) {
      return;
    }

    try {
      await createRequest({ ...data, locale: locale as Locale }).unwrap();

      showToast({
        severity: 'success',
        summary: tProjectsPage('request.success'),
        life: 3000,
        actionKey: ToastKeysEnum.PARTICIPATION_REQUEST,
      });
    } catch (error) {
      const errorData = error as
        | ((FetchBaseQueryError | SerializedError) & {
            status: number;
          })
        | undefined;
      const status = errorData?.status;

      if (status === 400) {
        showToast({
          severity: 'error',
          summary: tProjectsPage('request.error400'),
          life: 3000,
          actionKey: ToastKeysEnum.PARTICIPATION_REQUEST,
        });
      } else {
        showToast({
          severity: 'error',
          summary: tProjectsPage('request.error'),
          detail: tProjectsPage('request.errorDetails'),
          life: 3000,
          actionKey: ToastKeysEnum.PARTICIPATION_REQUEST,
        });
      }
    }
  };

  return (
    <>
      <form
        className={styles['participation-request-form']}
        onSubmit={handleSubmit(sendRequest)}
      >
        <div className={styles['participation-request-form__inner']}>
          <p className={labelClassNames}>{tForm('requestForm.field')}:</p>
          <Controller
            name="projectRoleId"
            control={control}
            render={({ field }) => (
              <RadioGroup
                {...field}
                options={vacantRoles}
                name="roles"
                roleTypeIds={roleTypeIds}
              />
            )}
          />
        </div>
        <div
          className={`
            ${styles['participation-request-form__actions']}
            ${
              size === 'small'
                ? styles['participation-request-form__actions--small']
                : styles['participation-request-form__actions--large']
            }
          `}
        >
          <Button
            color="green"
            type="submit"
            disabled={!isValid || !vacantRoles.length}
            loading={requestLoading}
          >
            {tButtons('sendRequest')}
          </Button>
        </div>
      </form>
      {isRequestBanner && (
        <DiscordBanner
          closeBanner={closeRequestBanner}
          isCancelButton
          withWrapper
        />
      )}
    </>
  );
}
