import { TFunctionType } from '@/shared/types/t-function.type';
import { z, ZodObject, ZodString } from 'zod';
import { statusNameValidator } from '../validators/statusNameValidator';
import { TaskStatusWithCountInterface } from '@/shared/interfaces/task-status-with-count.interface';

export const columnSchemaStatic = z.object({
  statusName: z.string(),
  boardId: z.string(),
  id: z.string(),
});

export const columnSchema = (
  t: TFunctionType,
  columns: TaskStatusWithCountInterface[],
  currentColumnId: string,
): ZodObject<{
  statusName: ZodString;
  boardId: ZodString;
  id: ZodString;
}> =>
  columnSchemaStatic.extend({
    statusName: statusNameValidator(t).refine(
      (value) =>
        !columns.some(
          (column) =>
            column.id !== currentColumnId && column.statusName.trim() === value,
        ),
      {
        message: t('errors.columnNameError'),
      },
    ),
  });
