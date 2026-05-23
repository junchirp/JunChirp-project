import { z, ZodObject, ZodString } from 'zod';
import { documentNameValidator } from '@/shared/forms/validators/documentNameValidator';
import { documentUrlValidator } from '@/shared/forms/validators/documentUrlValidator';

export const documentSchemaStatic = z.object({
  documentName: z.string(),
  url: z.string(),
  projectId: z.string(),
});

export const documentSchema = (
  t: (key: string) => string,
): ZodObject<{
  documentName: ZodString;
  url: ZodString;
  projectId: ZodString;
}> =>
  documentSchemaStatic.extend({
    documentName: documentNameValidator(t),
    url: documentUrlValidator(t),
    projectId: z.string(),
  });
