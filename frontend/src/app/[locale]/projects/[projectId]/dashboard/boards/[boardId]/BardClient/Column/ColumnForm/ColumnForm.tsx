'use client';

import React, { ReactElement, useEffect } from 'react';
import styles from './ColumnForm.module.scss';
import { Controller, useForm } from 'react-hook-form';
import { normalizeInputValue } from '@/shared/utils/normalizeInputValue';
import { useUpdateColumnMutation } from '@/api/boardsApi';
import { TaskStatusWithCountInterface } from '@/shared/interfaces/task-status-with-count.interface';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  columnSchema,
  columnSchemaStatic,
} from '@/shared/forms/schemas/columnSchema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type FormData = z.infer<typeof columnSchemaStatic>;

interface ColumnFormProps {
  currentColumn: TaskStatusWithCountInterface;
  columns: TaskStatusWithCountInterface[];
  onClose: () => void;
}

export default function ColumnForm(props: ColumnFormProps): ReactElement {
  const { currentColumn, columns, onClose } = props;
  const t = useTranslations('forms');
  const {
    handleSubmit,
    control,
    setFocus,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(columnSchema(t, columns, currentColumn.id)),
    mode: 'onChange',
    defaultValues: {
      statusName: currentColumn.statusName,
      boardId: currentColumn.boardId,
      id: currentColumn.id,
    },
  });

  useEffect(() => {
    setFocus('statusName');
  }, [setFocus]);

  const [updateColumn, { isLoading }] = useUpdateColumnMutation();

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      await updateColumn({
        id: data.id,
        statusName: data.statusName.trim(),
      }).unwrap();
      onClose();
    } catch {
      setError('statusName', { type: 'server' });
      setFocus('statusName');
    }
  };

  return (
    <form className={styles['column-form']} onSubmit={handleSubmit(onSubmit)}>
      <fieldset disabled={isLoading}>
        <Controller
          name="statusName"
          control={control}
          render={({ field }) => (
            <div className={styles['column-form__input-wrapper']}>
              <input
                className={`
                ${styles['column-form__input']}
                ${errors.statusName ? styles['column-form__input--invalid'] : ''}
              `}
                {...field}
                onChange={(e) => {
                  const normalized = normalizeInputValue(e.target.value);
                  field.onChange(normalized);
                }}
                onBlur={async () => {
                  field.onBlur();
                  void handleSubmit(onSubmit)();
                }}
              />
              {errors.statusName?.message && (
                <p className={styles['column-form__error']}>
                  <Image
                    src="/images/alert-circle.svg"
                    alt={'alert'}
                    width={12}
                    height={12}
                  />
                  {errors.statusName.message}
                </p>
              )}
            </div>
          )}
        />
      </fieldset>
    </form>
  );
}
