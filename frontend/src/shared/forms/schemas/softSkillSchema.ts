import { z, ZodObject, ZodString } from 'zod';
import { softSkillNameValidator } from '@/shared/forms/validators/softSkillNameValidator';
import { TFunctionType } from '@/shared/types/t-function.type';

export const softSkillSchemaStatic = z.object({
  softSkillName: z.string(),
});

export const softSkillSchema = (
  t: TFunctionType,
): ZodObject<{
  softSkillName: ZodString;
}> =>
  softSkillSchemaStatic.extend({
    softSkillName: softSkillNameValidator(t),
  });
