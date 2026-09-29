import { z, ZodObject, ZodString } from 'zod';
import { nonEmptyValidator } from '@/shared/forms/validators/nonEmptyValidator';
import { TFunctionType } from '@/shared/types/t-function.type';

export const inviteSchemaStatic = z.object({
  projectId: z.string(),
  projectRoleId: z.string(),
  userId: z.string(),
});

export const inviteSchema = (
  t: TFunctionType,
): ZodObject<{
  projectId: ZodString;
  projectRoleId: ZodString;
  userId: ZodString;
}> =>
  inviteSchemaStatic.extend({
    projectId: nonEmptyValidator(t),
    projectRoleId: nonEmptyValidator(t),
    userId: z.string(),
  });
