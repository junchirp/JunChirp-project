import { z, ZodString } from 'zod';

export const documentUrlValidator = (t: (key: string) => string): ZodString =>
  z
    .string()
    .nonempty(t('errors.nonEmpty'))
    .min(10, t('errors.documentUrlLength'))
    .max(255, t('errors.documentUrlLength'));
