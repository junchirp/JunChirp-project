import { z, ZodObject, ZodString } from 'zod';
import { hardSkillNameValidator } from '@/shared/forms/validators/hardSkillNameValidator';
import { TFunctionType } from '@/shared/types/t-function.type';

export const hardSkillSchemaStatic = z.object({
  hardSkillName: z.string(),
});

export const hardSkillSchema = (
  t: TFunctionType,
): ZodObject<{
  hardSkillName: ZodString;
}> =>
  hardSkillSchemaStatic.extend({
    hardSkillName: hardSkillNameValidator(t),
  });
