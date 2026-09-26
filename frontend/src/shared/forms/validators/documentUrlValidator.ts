import { z, ZodString } from 'zod';
import { isURL } from 'validator';
import { normalizeUrl } from '@/shared/utils/normalizeUrl';

export const documentUrlValidator = (t: (key: string) => string): ZodString =>
  z
    .string()
    .nonempty(t('errors.nonEmpty'))
    .min(10, t('errors.documentUrlLength'))
    .max(500, t('errors.documentUrlLength'))
    .refine((value) => isURL(normalizeUrl(value)), t('errors.urlInvalid'));
