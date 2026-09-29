import { z } from 'zod';
import { projectPublicUrlValidator } from '@/shared/forms/validators/projectPublicUrlValidator';
import { TFunctionType } from '@/shared/types/t-function.type';

export const completeProjectSchemaStatic = z.object({
  publicUrl: z.string(),
});

export const completeProjectSchema = (
  t: TFunctionType,
): typeof completeProjectSchemaStatic =>
  completeProjectSchemaStatic.extend({
    publicUrl: projectPublicUrlValidator(t),
  });
