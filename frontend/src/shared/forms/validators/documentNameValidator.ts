import { z, ZodString } from 'zod';
import { TFunctionType } from '@/shared/types/t-function.type';

export const documentNameValidator = (t: TFunctionType): ZodString =>
  z
    .string()
    .trim()
    .nonempty(t('errors.nonEmpty'))
    .min(2, t('errors.length', { min: 2, max: 100 }))
    .max(100, t('errors.length', { min: 2, max: 100 }))
    .regex(
      /^[A-Za-zА-Яа-яІіЇїЄєҐґ0-9 \-.,_'()/+]+$/,
      t('errors.invalidCharacters'),
    );
