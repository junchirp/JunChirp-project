import { LocaleType } from '../types/locale.type';
import { ColumnColor } from '@prisma/client';

export const DEFAULT_NAMES: Record<
  LocaleType,
  {
    board: string;
    column: string;
    defaultColumns: {
      statusName: string;
      columnIndex: number;
      color: ColumnColor;
    }[];
  }
> = {
  ua: {
    board: 'Дошка',
    column: 'Колонка',
    defaultColumns: [
      { statusName: 'До виконання', columnIndex: 1, color: ColumnColor.blue },
      { statusName: 'В процесі', columnIndex: 2, color: ColumnColor.yellow },
      { statusName: 'Готово', columnIndex: 3, color: ColumnColor.green },
    ],
  },
  en: {
    board: 'Board',
    column: 'Column',
    defaultColumns: [
      { statusName: 'To Do', columnIndex: 1, color: ColumnColor.blue },
      { statusName: 'In Progress', columnIndex: 2, color: ColumnColor.yellow },
      { statusName: 'Done', columnIndex: 3, color: ColumnColor.green },
    ],
  },
} as const;
