import { z } from 'zod';
import { nonEmptyValidator } from '@/shared/forms/validators/nonEmptyValidator';

export const ownershipSchemaStatic = z.object({
  ownerId: z.string(),
});

export const ownershipSchema = (
  t: (key: string) => string,
): typeof ownershipSchemaStatic =>
  ownershipSchemaStatic.extend({
    ownerId: nonEmptyValidator(t),
  });
