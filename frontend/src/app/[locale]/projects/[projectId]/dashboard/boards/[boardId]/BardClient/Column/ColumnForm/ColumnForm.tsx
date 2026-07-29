'use client';

import React, { ReactElement, useEffect } from 'react';
import styles from './ColumnForm.module.scss';
import { Controller, useForm } from 'react-hook-form';
import { normalizeInputValue } from '@/shared/utils/normalizeInputValue';
import { useUpdateColumnMutation } from '@/api/boardsApi';
import { TaskStatusInterface } from '@/shared/interfaces/task-status.interface';

interface FormData {
  statusName: string;
  boardId: string;
  id: string;
}

interface ColumnFormProps {
  currentColumn: TaskStatusInterface;
  columns: TaskStatusInterface[];
  onClose: () => void;
}

export default function ColumnForm(props: ColumnFormProps): ReactElement {
  const { currentColumn, columns, onClose } = props;
  const { handleSubmit, control, setFocus, setError } = useForm<FormData>({
    mode: 'onBlur',
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
        data: {
          statusName: data.statusName.trim(),
          boardId: data.boardId,
        },
      }).unwrap();
      onClose();
    } catch {
      setError('statusName', { type: 'server' });
      setFocus('statusName');
    }
  };

  return (
    <form className={styles['column-form']} onSubmit={handleSubmit(onSubmit)}>
      <fieldset
        className={styles['column-form__fieldset']}
        disabled={isLoading}
      >
        <Controller
          name="statusName"
          control={control}
          rules={{
            validate: (value) => {
              const normalizedValue = value.trim();
              const isDuplicate = columns.some(
                (item) =>
                  item.id !== currentColumn.id &&
                  item.statusName.trim() === normalizedValue,
              );
              return !isDuplicate;
            },
          }}
          render={({ field, fieldState }) => (
            <input
              className={`
                ${styles['column-form__input']}
                ${fieldState.invalid ? styles['column-form__input--invalid'] : ''}
              `}
              {...field}
              maxLength={30}
              onChange={(e) => {
                const normalized = normalizeInputValue(e.target.value);
                field.onChange(normalized);
              }}
              onBlur={async () => {
                field.onBlur();
                void handleSubmit(onSubmit)();
              }}
            />
          )}
        />
      </fieldset>
    </form>
  );
}
