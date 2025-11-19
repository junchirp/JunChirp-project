import { z, ZodObject, ZodString } from 'zod';
import { hardSkillNameValidator } from '@/shared/forms/validators/hardSkillNameValidator';

export const hardSkillSchemaStatic = z.object({
  hardSkillName: z.string(),
});

export const hardSkillSchema = (
  t: (key: string) => string,
): ZodObject<{
  hardSkillName: ZodString;
}> =>
  hardSkillSchemaStatic.extend({
    hardSkillName: hardSkillNameValidator(t),
  });
