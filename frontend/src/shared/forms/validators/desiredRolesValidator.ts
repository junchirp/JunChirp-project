import { z, ZodArray, ZodString } from 'zod';

export const desiredRolesValidator = (
  t: (key: string) => string,
): ZodArray<ZodString> =>
  z
    .array(z.string())
    .min(1, t('errors.nonEmpty'))
    .max(3, t('errors.desiredRolesMax'));
