import { z } from 'zod';
import { nonEmptyValidator } from '@/shared/forms/validators/nonEmptyValidator';
import { TFunctionType } from '@/shared/types/t-function.type';

export const ownershipSchemaStatic = z.object({
  ownerId: z.string(),
});

export const ownershipSchema = (
  t: TFunctionType,
): typeof ownershipSchemaStatic =>
  ownershipSchemaStatic.extend({
    ownerId: nonEmptyValidator(t),
  });
