'use client';

import React, { ReactElement, useEffect } from 'react';
import styles from './BoardForm.module.scss';
import { BoardInterface } from '@/shared/interfaces/board.interface';
import { useForm } from 'react-hook-form';
import Input from '@/shared/components/Input/Input';
import { useUpdateBoardMutation } from '@/api/boardsApi';
import { useTranslations } from 'next-intl';
import {
  boardSchema,
  boardSchemaStatic,
} from '@/shared/forms/schemas/boardSchena';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/shared/components/Button/Button';
import X from '@/assets/icons/x.svg';
import Check from '@/assets/icons/check.svg';
import { useToast } from '@/hooks/useToast';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';

type FormData = z.infer<typeof boardSchemaStatic>;

interface BoardFormProps {
  currentBoard: BoardInterface;
  boards: BoardInterface[];
  onClose: () => void;
}

export default function BoardForm(props: BoardFormProps): ReactElement {
  const { currentBoard, boards, onClose } = props;
  const t = useTranslations('forms');
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(boardSchema(t, boards, currentBoard.id)),
    mode: 'onChange',
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
  const { showToast, isActive } = useToast();

  const onSubmit = async (data: FormData): Promise<void> => {
    if (isActive(ToastKeysEnum.BOARD)) {
      return;
    }

    try {
      await updateBoard({
        id: data.id,
        boardName: data.boardName.trim(),
      }).unwrap();

      showToast({
        severity: 'success',
        summary: t('boardForm.success'),
        life: 3000,
        actionKey: ToastKeysEnum.BOARD,
      });
      onClose();
    } catch {
      showToast({
        severity: 'error',
        summary: t('boardForm.error'),
        detail: t('boardForm.errorDetails'),
        life: 3000,
        actionKey: ToastKeysEnum.BOARD,
      });
    }
  };

  return (
    <form className={styles['board-form']} onSubmit={handleSubmit(onSubmit)}>
      <fieldset className={styles['board-form__fieldset']} disabled={isLoading}>
        <Input
          {...register('boardName')}
          withError
          required
          normalize
          errorMessage={errors.boardName?.message}
        />
      </fieldset>
      <div className={styles['board-form__actions']}>
        <Button type="submit" color="green" icon={<Check />} />
        <Button color="red" icon={<X />} onClick={onClose} />
      </div>
    </form>
  );
}
