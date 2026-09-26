import { z, ZodString } from 'zod';
import { isURL } from 'validator';
import { normalizeUrl } from '@/shared/utils/normalizeUrl';

export const projectPublicUrlValidator = (
  t: (key: string) => string,
): ZodString =>
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
        message: t('errors.urlLength'),
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
        message: t('errors.urlInvalid'),
      },
    );
