import { z, ZodString } from 'zod';
import { TFunctionType } from '@/shared/types/t-function.type';

export const passwordValidator = (t: TFunctionType): ZodString =>
  z
    .string()
    .nonempty(t('errors.nonEmpty'))
    .min(8, t('errors.length', { min: 8, max: 20 }))
    .max(20, t('errors.length', { min: 8, max: 20 }))
    .refine(
      (val) => /^[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/.test(val),
      {
        message: t('errors.invalidCharacters'),
      },
    );
