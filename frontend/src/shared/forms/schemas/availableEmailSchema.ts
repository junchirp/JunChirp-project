import { z, ZodObject, ZodString } from 'zod';
import { availableEmailValidator } from '@/shared/forms/validators/emailValidator';

export const availableEmailSchemaStatic = z.object({
  email: z.string(),
});

export const availableEmailSchema = (
  t: (key: string) => string,
): ZodObject<{
  email: ZodString;
}> =>
  availableEmailSchemaStatic.extend({
    email: availableEmailValidator(t),
  });
