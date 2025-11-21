import { z, ZodString } from 'zod';

export const passwordValidator = (t: (key: string) => string): ZodString =>
  z
    .string()
    .nonempty(t('errors.nonEmpty'))
    .min(8, t('errors.passwordLength'))
    .max(20, t('errors.passwordLength'))
    .refine(
      (val) => /^[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/.test(val),
      {
        message: t('errors.passwordSymbols'),
      },
    );
