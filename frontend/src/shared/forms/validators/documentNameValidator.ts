import { z, ZodString } from 'zod';

export const documentNameValidator = (t: (key: string) => string): ZodString =>
  z
    .string()
    .trim()
    .nonempty(t('errors.nonEmpty'))
    .min(2, t('errors.documentNameLength'))
    .max(100, t('errors.documentNameLength'))
    .regex(
      /^[A-Za-zА-Яа-яІіЇїЄєҐґ0-9 \-.,_'()/+]+$/,
      t('errors.documentNameSymbols'),
    );
