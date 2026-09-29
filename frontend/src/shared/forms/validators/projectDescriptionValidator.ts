import { z, ZodString } from 'zod';
import { TFunctionType } from '@/shared/types/t-function.type';

export const projectDescriptionValidator = (t: TFunctionType): ZodString =>
  z
    .string()
    .trim()
    .nonempty(t('errors.nonEmpty'))
    .min(2, t('errors.length', { min: 2, max: 500 }))
    .max(500, t('errors.length', { min: 2, max: 500 }))
    .regex(
      /^[A-Za-zА-Яа-яІіЇїЄєҐґ0-9 \-+/_.',()]+$/,
      t('errors.invalidCharacters'),
    );
