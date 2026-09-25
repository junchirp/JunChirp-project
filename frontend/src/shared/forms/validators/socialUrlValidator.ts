import { z, ZodString } from 'zod';

export const socialUrlValidator = (t: (key: string) => string): ZodString =>
  z
    .string()
    .trim()
    .nonempty(t('errors.nonEmpty'))
    .min(10, t('errors.urlLength'))
    .max(255, t('errors.urlLength'));
