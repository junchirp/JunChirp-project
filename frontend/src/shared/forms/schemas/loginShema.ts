import { z, ZodObject, ZodString } from 'zod';
import { nonEmptyValidator } from '@/shared/forms/validators/nonEmptyValidator';
import { basicEmailValidator } from '@/shared/forms/validators/emailValidator';

export const loginSchemaStatic = z.object({
  email: z.string(),
  password: z.string(),
});

export const loginSchema = (
  t: (key: string) => string,
): ZodObject<{
  email: ZodString;
  password: ZodString;
}> =>
  loginSchemaStatic.extend({
    email: basicEmailValidator(t),
    password: nonEmptyValidator(t),
  });
