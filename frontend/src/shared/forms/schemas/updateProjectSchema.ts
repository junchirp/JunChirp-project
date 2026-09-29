import { z, ZodObject, ZodString } from 'zod';
import { nonEmptyValidator } from '@/shared/forms/validators/nonEmptyValidator';
import { projectNameValidator } from '@/shared/forms/validators/projectNameValidator';
import { projectDescriptionValidator } from '@/shared/forms/validators/projectDescriptionValidator';
import { TFunctionType } from '@/shared/types/t-function.type';

export const updateProjectSchemaStatic = z.object({
  projectName: z.string(),
  description: z.string(),
  categoryId: z.string(),
});

export const updateProjectSchema = (
  t: TFunctionType,
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
