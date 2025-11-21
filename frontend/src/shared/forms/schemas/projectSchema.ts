import { z, ZodArray, ZodObject, ZodString } from 'zod';
import { nonEmptyValidator } from '../validators/nonEmptyValidator';
import { projectNameValidator } from '../validators/projectNameValidator';
import { projectDescriptionValidator } from '../validators/projectDescriptionValidator';

export const projectSchemaStatic = z.object({
  projectName: z.string(),
  description: z.string(),
  categoryId: z.string(),
  rolesIds: z.array(z.string()),
});

export const projectSchema = (
  t: (key: string) => string,
): ZodObject<{
  projectName: ZodString;
  description: ZodString;
  categoryId: ZodString;
  rolesIds: ZodArray<ZodString>;
}> =>
  projectSchemaStatic.extend({
    projectName: projectNameValidator(t),
    description: projectDescriptionValidator(t),
    categoryId: nonEmptyValidator(t),
    rolesIds: z.array(z.string()),
  });
