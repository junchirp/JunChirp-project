import { z, ZodString } from 'zod';
import { TFunctionType } from '@/shared/types/t-function.type';

export const taskDescriptionValidator = (t: TFunctionType): ZodString =>
  z
    .string()
    .trim()
    .refine(
      (value) => {
        if (!value) {
          return true;
        }
        return value.length >= 2 && value.length <= 1000;
      },
      {
        message: t('errors.length', { min: 2, max: 1000 }),
      },
    )
    .refine(
      (value) => {
        if (!value) {
          return true;
        }
        return /^[A-Za-zА-Яа-яІіЇїЄєҐґ0-9 \-+/_.'"«»,()]+$/.test(value);
      },
      {
        message: t('errors.invalidCharacters'),
      },
    );
