import { z, ZodString } from 'zod';

export const supportRequestValidator = (
  t: (key: string) => string,
): ZodString =>
  z
    .string()
    .trim()
    .nonempty(t('errors.nonEmpty'))
    .min(10, t('errors.requestLength'))
    .max(1000, t('errors.requestLength'))
    .regex(
      /^[0-9a-zA-Zа-яА-ЯґҐіІїЇєЄ'’ .,;:!?()\n\r-]+$/,
      t('errors.requestSymbols'),
    );
