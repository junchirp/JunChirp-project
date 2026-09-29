import { z, ZodString } from 'zod';
import { TFunctionType } from '@/shared/types/t-function.type';

export const hardSkillNameValidator = (t: TFunctionType): ZodString =>
  z
    .string()
    .trim()
    .nonempty(t('errors.nonEmpty'))
    .min(2, t('errors.length', { min: 2, max: 50 }))
    .max(50, t('errors.length', { min: 2, max: 50 }))
    .regex(
      /^[A-Za-zА-Яа-яІіЇїЄєҐґ0-9 .'\-+_/,()]+$/,
      t('errors.invalidCharacters'),
    );
