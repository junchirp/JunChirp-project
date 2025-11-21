import { z, ZodObject, ZodString } from 'zod';
import { passwordValidator } from '@/shared/forms/validators/passwordValidator';
import { nonEmptyValidator } from '@/shared/forms/validators/nonEmptyValidator';

export const passwordSchemaStatic = z.object({
  password: z.string(),
  confirmPassword: z.string(),
});

export const passwordSchema = (
  t: (key: string) => string,
): ZodObject<{
  password: ZodString;
  confirmPassword: ZodString;
}> =>
  passwordSchemaStatic.extend({
    password: passwordValidator(t),
    confirmPassword: nonEmptyValidator(t),
  });
