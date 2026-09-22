'use client';

import React, { ReactElement, useEffect } from 'react';
import styles from './OwnershipPopup.module.scss';
import { ProjectInterface } from '@/shared/interfaces/project.interface';
import Dialog from '@/shared/components/Dialog/Dialog';
import DialogHeader from '@/shared/components/Dialog/DialogHeader/DialogHeader';
import DialogBody from '@/shared/components/Dialog/DialogBody/DialogBody';
import DialogFooter from '@/shared/components/Dialog/DialogFooter/DialogFooter';
import Button from '@/shared/components/Button/Button';
import { useTransferOwnershipMutation } from '@/api/projectsApi';
import Dropdown from '@/shared/components/Dropdown/Dropdown';
import { Controller, useForm } from 'react-hook-form';
import {
  ownershipSchema,
  ownershipSchemaStatic,
} from '@/shared/forms/schemas/ownershipSchema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { useToast } from '@/hooks/useToast';
import { useRouter } from '@/i18n/routing';
import { isDiscordNotConnectedError } from '@/shared/utils/isDiscordNotConnectedError';
import { isDiscordNotInGuildError } from '@/shared/utils/isDiscordNotInGuildError';

interface OwnershipPopupProps {
  project: ProjectInterface;
  isOpen: boolean;
  onClose: () => void;
}

type FormData = z.infer<typeof ownershipSchemaStatic>;

export default function OwnershipPopup(
  props: OwnershipPopupProps,
): ReactElement {
  const { project, isOpen, onClose } = props;
  const { showToast, isActive } = useToast();
  const router = useRouter();
  const tForms = useTranslations('forms');
  const tOwnership = useTranslations('ownershipPopup');
  const tButtons = useTranslations('buttons');
  const {
    handleSubmit,
    control,
    reset,
    formState: { isValid },
  } = useForm<FormData>({
    resolver: zodResolver(ownershipSchema(tForms)),
    mode: 'onChange',
    defaultValues: {
      ownerId: '',
    },
  });
  const [transferOwnership, { isLoading }] = useTransferOwnershipMutation();
  const members = project.roles.flatMap((role) => role.users) ?? [];

  useEffect(() => {
    if (isOpen) {
      reset({ ownerId: '' });
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: FormData): Promise<void> => {
    if (isActive(ToastKeysEnum.OWNERSHIP)) {
      return;
    }

    try {
      await transferOwnership({
        projectId: project.id,
        ownerId: data.ownerId,
      }).unwrap();

      showToast({
        severity: 'success',
        summary: tOwnership('success'),
        life: 3000,
        actionKey: ToastKeysEnum.OWNERSHIP,
      });

      onClose();
      router.replace('/projects');
    } catch (error) {
      if (isDiscordNotConnectedError(error)) {
        // TODO: show special toast
        return;
      }

      if (isDiscordNotInGuildError(error)) {
        // TODO: show special toast
        return;
      }

      showToast({
        severity: 'error',
        summary: tOwnership('error'),
        detail: tOwnership('errorDetails'),
        life: 3000,
        actionKey: ToastKeysEnum.OWNERSHIP,
      });
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader title={tOwnership('title')} />
      <DialogBody>
        <div className={styles['ownership-popup__body']}>
          <form
            id="ownership-form"
            className={styles['ownership-popup__form']}
            onSubmit={handleSubmit(onSubmit)}
          >
            <fieldset disabled={isLoading}>
              <Controller
                name="ownerId"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    label={tForms('ownershipForm.ownerId')}
                    options={members}
                    getOptionLabel={(o) => `${o.firstName} ${o.lastName}`}
                    getOptionValue={(o) => o.id}
                    placeholder={tForms('ownershipForm.placeholders.ownerId')}
                  />
                )}
              />
            </fieldset>
          </form>
          {isValid && (
            <p className={styles['ownership-popup__text']}>
              {tOwnership('warning')}
            </p>
          )}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button color="green" variant="secondary-frame" onClick={onClose}>
          {tButtons('cancel')}
        </Button>
        <Button
          color="green"
          type="submit"
          loading={isLoading}
          disabled={!isValid}
          form="ownership-form"
        >
          {tButtons('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
