import { z, ZodObject, ZodString } from 'zod';
import { socialUrlValidator } from '@/shared/forms/validators/socialUrlValidator';
import { socialRefinement } from '@/shared/forms/refinements/socialRefinement';
import { nonEmptyValidator } from '@/shared/forms/validators/nonEmptyValidator';
import { TFunctionType } from '@/shared/types/t-function.type';

export const socialSchemaStatic = z.object({
  network: z.string(),
  url: z.string(),
});

export const socialSchema = (
  t: TFunctionType,
): ZodObject<{
  network: ZodString;
  url: ZodString;
}> =>
  socialSchemaStatic
    .extend({
      network: nonEmptyValidator(t),
      url: socialUrlValidator(t),
    })
    .superRefine(socialRefinement(t));
