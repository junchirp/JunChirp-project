import { z, ZodObject, ZodRecord, ZodString, ZodType } from 'zod';
import { forbiddenDomainValidator } from '@/shared/forms/validators/emailValidator';
import { supportRequestValidator } from '@/shared/forms/validators/supportRequestValidator';
import { SerializedEditorState } from 'lexical';

export const supportSchemaStatic = z.object({
  email: z.string(),
  request: z.custom<SerializedEditorState>(),
  requestText: z.string(),
});

export const supportSchema = (
  t: (key: string) => string,
): typeof supportSchemaStatic =>
  supportSchemaStatic.extend({
    email: forbiddenDomainValidator(t),
    requestText: supportRequestValidator(t),
  });
