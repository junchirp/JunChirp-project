import { z, ZodBoolean } from 'zod';

export const agreementValidator = (t: (key: string) => string): ZodBoolean =>
  z.boolean().refine((val) => val, {
    message: t('errors.agreement'),
  });
