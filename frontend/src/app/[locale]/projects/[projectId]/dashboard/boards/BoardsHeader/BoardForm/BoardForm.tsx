'use client';

import React, { ReactElement, useEffect } from 'react';
import styles from './BoardForm.module.scss';
import { BoardInterface } from '@/shared/interfaces/board.interface';
import { Controller, useForm } from 'react-hook-form';
import Input from '@/shared/components/Input/Input';
import { normalizeInputValue } from '@/shared/utils/normalizeInputValue';
import { useUpdateBoardMutation } from '@/api/boardsApi';

interface FormData {
  boardName: string;
  projectId: string;
  id: string;
}

interface BoardFormProps {
  board: BoardInterface;
  onClose: () => void;
}

export default function BoardForm(props: BoardFormProps): ReactElement {
  const { board, onClose } = props;
  const { handleSubmit, control, setFocus } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: {
      boardName: board.boardName,
      projectId: board.projectId,
      id: board.id,
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
    } finally {
      onClose();
    }
  };

  return (
    <form className={styles['board-form']} onSubmit={handleSubmit(onSubmit)}>
      <fieldset className={styles['board-form__fieldset']} disabled={isLoading}>
        <Controller
          name="boardName"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              maxLength={50}
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
