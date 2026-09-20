import { z, ZodObject, ZodString } from 'zod';
import { nonEmptyValidator } from '@/shared/forms/validators/nonEmptyValidator';
import { projectNameValidator } from '@/shared/forms/validators/projectNameValidator';
import { projectDescriptionValidator } from '@/shared/forms/validators/projectDescriptionValidator';

export const updateProjectSchemaStatic = z.object({
  projectName: z.string(),
  description: z.string(),
  categoryId: z.string(),
});

export const updateProjectSchema = (
  t: (key: string) => string,
): ZodObject<{
  projectName: ZodString;
  description: ZodString;
  categoryId: ZodString;
}> =>
  updateProjectSchemaStatic.extend({
    projectName: projectNameValidator(t),
    description: projectDescriptionValidator(t),
    categoryId: nonEmptyValidator(t),
  });
