import { z, ZodObject, ZodString } from 'zod';
import { softSkillNameValidator } from '@/shared/forms/validators/softSkillNameValidator';

export const softSkillSchemaStatic = z.object({
  softSkillName: z.string(),
});

export const softSkillSchema = (
  t: (key: string) => string,
): ZodObject<{
  softSkillName: ZodString;
}> =>
  softSkillSchemaStatic.extend({
    softSkillName: softSkillNameValidator(t),
  });
