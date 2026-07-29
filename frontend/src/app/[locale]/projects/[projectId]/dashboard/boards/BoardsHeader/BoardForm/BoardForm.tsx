'use client';

import React, { ReactElement, useEffect } from 'react';
import styles from './BoardForm.module.scss';
import { BoardInterface } from '@/shared/interfaces/board.interface';
import { Controller, useForm } from 'react-hook-form';
import Input from '@/shared/components/Input/Input';
import { normalizeInputValue } from '@/shared/utils/normalizeInputValue';
import { useUpdateBoardMutation } from '@/api/boardsApi';
import { useTranslations } from 'next-intl';

interface FormData {
  boardName: string;
  projectId: string;
  id: string;
}

interface BoardFormProps {
  currentBoard: BoardInterface;
  boards: BoardInterface[];
  onClose: () => void;
}

export default function BoardForm(props: BoardFormProps): ReactElement {
  const { currentBoard, boards, onClose } = props;
  const t = useTranslations('boards');
  const { handleSubmit, control, setFocus, setError } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: {
      boardName: currentBoard.boardName,
      projectId: currentBoard.projectId,
      id: currentBoard.id,
    },
  });

  useEffect(() => {
    setFocus('boardName');
  }, [setFocus]);

  const [updateBoard, { isLoading }] = useUpdateBoardMutation();

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      await updateBoard({
        id: data.id,
        data: {
          boardName: data.boardName.trim(),
          projectId: data.projectId,
        },
      }).unwrap();
      onClose();
    } catch {
      setError('boardName', {
        type: 'server',
        message: t('bordNameError'),
      });

      setFocus('boardName');
    }
  };

  return (
    <form className={styles['board-form']} onSubmit={handleSubmit(onSubmit)}>
      <fieldset className={styles['board-form__fieldset']} disabled={isLoading}>
        <Controller
          name="boardName"
          control={control}
          rules={{
            validate: (value) => {
              const normalizedValue = value.trim();
              const isDuplicate = boards.some(
                (item) =>
                  item.id !== currentBoard.id &&
                  item.boardName.trim() === normalizedValue,
              );
              return isDuplicate ? t('bordNameError') : true;
            },
          }}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              maxLength={50}
              withError={fieldState.invalid}
              errorMessage={fieldState.error?.message}
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
