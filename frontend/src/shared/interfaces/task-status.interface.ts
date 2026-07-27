import { ColumnColorType } from '@/shared/types/column-color.type';

export interface TaskStatusInterface {
  id: string;
  statusName: string;
  columnIndex: number;
  boardId: string;
  color: ColumnColorType;
  tasksCount: number;
}
