import { z, ZodObject, ZodString } from 'zod';
import { educationValidator } from '../validators/educationValidator';

export const educationSchemaStatic = z.object({
  institution: z.string(),
  specialization: z.string(),
});

export const educationSchema = (
  t: (key: string) => string,
): ZodObject<{
  institution: ZodString;
  specialization: ZodString;
}> =>
  educationSchemaStatic.extend({
    institution: educationValidator(t),
    specialization: educationValidator(t),
  });
