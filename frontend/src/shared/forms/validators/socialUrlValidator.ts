import { z, ZodString } from 'zod';
import { TFunctionType } from '@/shared/types/t-function.type';

export const socialUrlValidator = (t: TFunctionType): ZodString =>
  z
    .string()
    .trim()
    .nonempty(t('errors.nonEmpty'))
    .min(10, t('errors.length', { min: 10, max: 255 }))
    .max(255, t('errors.length', { min: 10, max: 255 }));
