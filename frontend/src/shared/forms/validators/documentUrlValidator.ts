import { z, ZodString } from 'zod';
import { isURL } from 'validator';
import { normalizeUrl } from '@/shared/utils/normalizeUrl';
import { TFunctionType } from '@/shared/types/t-function.type';

export const documentUrlValidator = (t: TFunctionType): ZodString =>
  z
    .string()
    .nonempty(t('errors.nonEmpty'))
    .min(10, t('errors.length', { min: 10, max: 500 }))
    .max(500, t('errors.length', { min: 10, max: 500 }))
    .refine(
      (value) =>
        isURL(normalizeUrl(value), {
          protocols: ['http', 'https'],
          require_protocol: true,
        }),
      t('errors.invalidUrl'),
    );
