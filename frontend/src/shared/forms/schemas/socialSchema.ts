import { z, ZodObject, ZodString } from 'zod';
import { networkUrlValidator } from '@/shared/forms/validators/networkUrlValidator';
import { socialRefinement } from '@/shared/forms/refinements/socialRefinement';
import { nonEmptyValidator } from '@/shared/forms/validators/nonEmptyValidator';

export const socialSchemaStatic = z.object({
  network: z.string(),
  url: z.string(),
});

export const socialSchema = (
  t: (key: string) => string,
): ZodObject<{
  network: ZodString;
  url: ZodString;
}> =>
  socialSchemaStatic
    .extend({
      network: nonEmptyValidator(t),
      url: networkUrlValidator(t),
    })
    .superRefine(socialRefinement(t));
