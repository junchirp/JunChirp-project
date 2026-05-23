'use client';

import React, { ReactElement, useEffect } from 'react';
import styles from './DocsForm.module.scss';
import { z } from 'zod';
import {
  documentSchema,
  documentSchemaStatic,
} from '@/shared/forms/schemas/documentSchema';
import { DocumentInterface } from '@/shared/interfaces/ducument.interface';
import {
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
} from '@/api/documentsApi';
import { useToast } from '@/hooks/useToast';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import Input from '@/shared/components/Input/Input';
import { normalizeInputValue } from '@/shared/utils/normalizeInputValue';
import Button from '@/shared/components/Button/Button';
import { useParams } from 'next/navigation';

type FormData = z.infer<typeof documentSchemaStatic>;

interface DocsFormProps {
  initialValues?: DocumentInterface;
  onCancel: () => void;
}

export default function DocsForm(props: DocsFormProps): ReactElement {
  const { initialValues, onCancel } = props;
  const { id } = useParams<{ id: string }>();
  const [updateDocument, { isLoading: updateDocumentLoading }] =
    useUpdateDocumentMutation();
  const [createDocument, { isLoading: createDocumentLoading }] =
    useCreateDocumentMutation();
  const isLoading = createDocumentLoading || updateDocumentLoading;
  const { showToast, isActive } = useToast();
  const tForms = useTranslations('forms');
  const tButtons = useTranslations('buttons');
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(documentSchema(tForms)),
    mode: 'onChange',
    defaultValues: {
      documentName: '',
      url: '',
      projectId: '',
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        documentName: initialValues.documentName,
        url: initialValues.url,
        projectId: initialValues.projectId,
      });
    } else {
      reset({
        documentName: '',
        url: '',
        projectId: id,
      });
    }
  }, [initialValues, reset]);

  const onSubmit = async (data: FormData): Promise<void> => {
    if (isActive(ToastKeysEnum.DOCUMENT)) {
      return;
    }

    let url = data.url.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }
    const preparedData = { ...data, url };

    if (initialValues) {
      try {
        await updateDocument({
          id: initialValues.id,
          data: preparedData,
        }).unwrap();

        showToast({
          severity: 'success',
          summary: tForms('documentForm.success'),
          life: 3000,
          actionKey: ToastKeysEnum.DOCUMENT,
        });
        onCancel();
      } catch (error) {
        const errorData = error as
          | ((FetchBaseQueryError | SerializedError) & {
              status: number;
            })
          | undefined;
        const status = errorData?.status;
        if (status === 409) {
          showToast({
            severity: 'error',
            summary: tForms('documentForm.error409'),
            life: 3000,
            actionKey: ToastKeysEnum.DOCUMENT,
          });
        } else {
          showToast({
            severity: 'error',
            summary: tForms('documentForm.error'),
            life: 3000,
            actionKey: ToastKeysEnum.DOCUMENT,
          });
        }
      }
    } else {
      try {
        await createDocument(preparedData).unwrap();

        showToast({
          severity: 'success',
          summary: tForms('documentForm.success'),
          life: 3000,
          actionKey: ToastKeysEnum.DOCUMENT,
        });
        onCancel();
      } catch (error) {
        const errorData = error as
          | ((FetchBaseQueryError | SerializedError) & {
              status: number;
            })
          | undefined;
        const status = errorData?.status;
        if (status === 409) {
          showToast({
            severity: 'error',
            summary: tForms('documentForm.error409'),
            life: 3000,
            actionKey: ToastKeysEnum.DOCUMENT,
          });
        } else {
          showToast({
            severity: 'error',
            summary: tForms('documentForm.error'),
            life: 3000,
            actionKey: ToastKeysEnum.DOCUMENT,
          });
        }
      }
    }
  };

  return (
    <div className={styles['docs-form']}>
      <form
        className={styles['docs-form__form']}
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset
          className={styles['docs-form__fieldset']}
          disabled={isLoading}
        >
          <Controller
            name="documentName"
            control={control}
            render={({ field }) => (
              <Input
                label={tForms('documentForm.documentName')}
                placeholder={tForms('documentForm.placeholders.documentName')}
                {...field}
                value={field.value ?? ''}
                onChange={(e) => {
                  const normalized = normalizeInputValue(e.target.value);
                  field.onChange(normalized);
                }}
                withError
                errorMessage={errors.documentName?.message}
              />
            )}
          />
          <Input
            {...register('url')}
            label={tForms('documentForm.url')}
            placeholder={tForms('documentForm.placeholders.url')}
            withError
            errorMessage={errors.url?.message}
          />
        </fieldset>
        <div className={styles['docs-form__actions']}>
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
    </div>
  );
}
