import { z, ZodArray, ZodObject, ZodString } from 'zod';
import { userNameValidator } from '@/shared/forms/validators/userNameValidator';
import { desiredRolesValidator } from '../validators/desiredRolesValidator';

export const userNameSchemaStatic = z.object({
  firstName: z.string(),
  lastName: z.string(),
  desiredRolesIds: z.array(z.string()),
});

export const userNameSchema = (
  t: (key: string) => string,
): ZodObject<{
  firstName: ZodString;
  lastName: ZodString;
  desiredRolesIds: ZodArray<ZodString>;
}> =>
  userNameSchemaStatic.extend({
    firstName: userNameValidator(t),
    lastName: userNameValidator(t),
    desiredRolesIds: desiredRolesValidator(t),
  });
