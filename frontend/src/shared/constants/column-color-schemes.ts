import { ColumnColorType } from '@/shared/types/column-color.type';
import { ColumnColorSchemeInterface } from '@/shared/interfaces/column-color-scheme.interface';

export const COLUMN_COLOR_SCHEMES: Record<
  ColumnColorType,
  ColumnColorSchemeInterface
> = {
  blue: { background: '#295BFF', text: '#FEFEFE' },
  yellow: { background: '#FDDB00', text: '#141416' },
  green: { background: '#00D18B', text: '#141416' },
  magenta: { background: '#BB48D2', text: '#FEFEFE' },
  orange: { background: '#D56A3B', text: '#FEFEFE' },
  pink: { background: '#FF5C7A', text: '#FEFEFE' },
  violet: { background: '#7C4DFF', text: '#FEFEFE' },
  cyan: { background: '#00A8CC', text: '#FEFEFE' },
  lime: { background: '#8BC34A', text: '#141416' },
  amber: { background: '#F59E0B', text: '#141416' },
};
