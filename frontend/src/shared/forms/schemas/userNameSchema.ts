import { z, ZodArray, ZodObject, ZodString } from 'zod';
import { userNameValidator } from '@/shared/forms/validators/userNameValidator';
import { desiredRolesValidator } from '../validators/desiredRolesValidator';

export const userNameSchemaBaseStatic = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

export const userNameSchemaStatic = userNameSchemaBaseStatic.extend({
  desiredRolesIds: z.array(z.string()),
});

export const userNameSchemaBase = (
  t: (key: string) => string,
): ZodObject<{
  firstName: ZodString;
  lastName: ZodString;
}> =>
  userNameSchemaBaseStatic.extend({
    firstName: userNameValidator(t),
    lastName: userNameValidator(t),
  });

export const userNameSchema = (
  t: (key: string) => string,
): ZodObject<{
  firstName: ZodString;
  lastName: ZodString;
  desiredRolesIds: ZodArray<ZodString>;
}> =>
  userNameSchemaBase(t).extend({
    desiredRolesIds: desiredRolesValidator(t),
  });
