import { z, ZodObject, ZodString } from 'zod';
import { usedEmailValidator } from '@/shared/forms/validators/emailValidator';

export const usedEmailSchemaStatic = z.object({
  email: z.string(),
});

export const usedEmailSchema = (
  t: (key: string) => string,
): ZodObject<{
  email: ZodString;
}> =>
  usedEmailSchemaStatic.extend({
    email: usedEmailValidator(t),
  });
