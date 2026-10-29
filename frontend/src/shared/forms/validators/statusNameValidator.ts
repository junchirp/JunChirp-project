import { z, ZodString } from 'zod';
import { TFunctionType } from '@/shared/types/t-function.type';

export const statusNameValidator = (t: TFunctionType): ZodString =>
  z
    .string()
    .trim()
    .nonempty(t('errors.nonEmpty'))
    .min(2, t('errors.length', { min: 2, max: 30 }))
    .max(30, t('errors.length', { min: 2, max: 30 }))
    .regex(
      /^[a-zA-Zа-яА-ЯіІїЇєЄґҐ0-9 _'".,()/+-]+$/,
      t('errors.invalidCharacters'),
    );
