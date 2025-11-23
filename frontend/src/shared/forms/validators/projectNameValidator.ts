import { z, ZodString } from 'zod';

export const projectNameValidator = (t: (key: string) => string): ZodString =>
  z
    .string()
    .trim()
    .nonempty(t('errors.nonEmpty'))
    .min(2, t('errors.projectNameLength'))
    .max(50, t('errors.projectNameLength'));
