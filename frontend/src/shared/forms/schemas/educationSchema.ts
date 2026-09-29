import { z, ZodObject, ZodString } from 'zod';
import { educationValidator } from '@/shared/forms/validators/educationValidator';
import { TFunctionType } from '@/shared/types/t-function.type';

export const educationSchemaStatic = z.object({
  institution: z.string(),
  specialization: z.string(),
});

export const educationSchema = (
  t: TFunctionType,
): ZodObject<{
  institution: ZodString;
  specialization: ZodString;
}> =>
  educationSchemaStatic.extend({
    institution: educationValidator(t),
    specialization: educationValidator(t),
  });
