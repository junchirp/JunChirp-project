import { z, ZodObject, ZodString } from 'zod';
import { forbiddenDomainValidator } from '@/shared/forms/validators/emailValidator';
import { supportRequestValidator } from '@/shared/forms/validators/supportRequestValidator';

export const supportSchemaStatic = z.object({
  email: z.string(),
  requestHtml: z.string(),
  requestText: z.string(),
});

export const supportSchema = (
  t: (key: string) => string,
): ZodObject<{
  email: ZodString;
  requestHtml: ZodString;
  requestText: ZodString;
}> =>
  supportSchemaStatic.extend({
    email: forbiddenDomainValidator(t),
    requestHtml: z.string(),
    requestText: supportRequestValidator(t),
  });
