import { z, ZodObject, ZodString } from 'zod';
import { availableEmailValidator } from '@/shared/forms/validators/emailValidator';
import { TFunctionType } from '@/shared/types/t-function.type';

export const availableEmailSchemaStatic = z.object({
  email: z.string(),
});

export const availableEmailSchema = (
  t: TFunctionType,
): ZodObject<{
  email: ZodString;
}> =>
  availableEmailSchemaStatic.extend({
    email: availableEmailValidator(t),
  });
