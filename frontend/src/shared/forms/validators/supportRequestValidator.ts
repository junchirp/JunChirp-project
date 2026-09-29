import { z, ZodString } from 'zod';
import { TFunctionType } from '@/shared/types/t-function.type';

export const supportRequestValidator = (t: TFunctionType): ZodString =>
  z
    .string()
    .trim()
    .nonempty(t('errors.nonEmpty'))
    .min(10, t('errors.length', { min: 10, max: 1000 }))
    .max(1000, t('errors.length', { min: 10, max: 1000 }))
    .regex(
      /^[0-9a-zA-Zа-яА-ЯґҐіІїЇєЄ' .,;:!?()\n\r-]+$/,
      t('errors.invalidCharacters'),
    );
