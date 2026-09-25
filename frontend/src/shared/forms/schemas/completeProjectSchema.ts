import { z } from 'zod';
import { projectPublicUrlValidator } from '@/shared/forms/validators/projectPublicUrlValidator';

export const completeProjectSchemaStatic = z.object({
  publicUrl: z.string(),
});

export const completeProjectSchema = (
  t: (key: string) => string,
): typeof completeProjectSchemaStatic =>
  completeProjectSchemaStatic.extend({
    publicUrl: projectPublicUrlValidator(t),
  });
