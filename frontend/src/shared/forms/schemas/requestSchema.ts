import { z, ZodObject, ZodString } from 'zod';
import { nonEmptyValidator } from '@/shared/forms/validators/nonEmptyValidator';

export const requestSchemaStatic = z.object({
  projectId: z.string(),
  projectRoleId: z.string(),
  userId: z.string(),
});

export const requestSchema = (
  t: (key: string) => string,
): ZodObject<{
  projectId: ZodString;
  projectRoleId: ZodString;
  userId: ZodString;
}> =>
  requestSchemaStatic.extend({
    projectId: nonEmptyValidator(t),
    projectRoleId: nonEmptyValidator(t),
    userId: z.string(),
  });
