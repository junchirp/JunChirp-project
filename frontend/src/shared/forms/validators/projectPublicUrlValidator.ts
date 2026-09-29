import { z, ZodString } from 'zod';
import { isURL } from 'validator';
import { normalizeUrl } from '@/shared/utils/normalizeUrl';
import { TFunctionType } from '@/shared/types/t-function.type';

export const projectPublicUrlValidator = (t: TFunctionType): ZodString =>
  z
    .string()
    .refine(
      (value) => {
        if (!value) {
          return true;
        }

        const normalizedUrl = normalizeUrl(value);
        return normalizedUrl.length >= 10 && normalizedUrl.length <= 255;
      },
      {
        message: t('errors.length', { min: 10, max: 255 }),
      },
    )
    .refine(
      (value) => {
        if (!value) {
          return true;
        }

        return isURL(normalizeUrl(value), {
          protocols: ['http', 'https'],
          require_protocol: true,
        });
      },
      {
        message: t('errors.invalidUrl'),
      },
    );
