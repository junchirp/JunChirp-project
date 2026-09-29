import { z } from 'zod';
import { forbiddenDomainValidator } from '@/shared/forms/validators/emailValidator';
import { supportRequestValidator } from '@/shared/forms/validators/supportRequestValidator';
import { SerializedEditorState } from 'lexical';
import { TFunctionType } from '@/shared/types/t-function.type';

export const supportSchemaStatic = z.object({
  email: z.string(),
  request: z.custom<SerializedEditorState>(),
  requestText: z.string(),
});

export const supportSchema = (t: TFunctionType): typeof supportSchemaStatic =>
  supportSchemaStatic.extend({
    email: forbiddenDomainValidator(t),
    requestText: supportRequestValidator(t),
  });
