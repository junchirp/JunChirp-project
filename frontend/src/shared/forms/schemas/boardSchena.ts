import { TFunctionType } from '@/shared/types/t-function.type';
import { z, ZodObject, ZodString } from 'zod';
import { boardNameValidator } from '../validators/boardNameValidator';
import { BoardInterface } from '@/shared/interfaces/board.interface';

export const boardSchemaStatic = z.object({
  boardName: z.string(),
  projectId: z.string(),
  id: z.string(),
});

export const boardSchema = (
  t: TFunctionType,
  boards: BoardInterface[],
  currentBoardId: string,
): ZodObject<{
  boardName: ZodString;
  projectId: ZodString;
  id: ZodString;
}> =>
  boardSchemaStatic.extend({
    boardName: boardNameValidator(t).refine(
      (value) =>
        !boards.some(
          (board) =>
            board.id !== currentBoardId && board.boardName.trim() === value,
        ),
      {
        message: t('errors.bordNameError'),
      },
    ),
  });
