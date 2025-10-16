import { z } from 'zod';
import { networkNameValidator } from '@/shared/forms/validators/networkNameValidator';
import { networkUrlValidator } from '@/shared/forms/validators/networkUrlValidator';
import { socialRefinement } from '@/shared/forms/refinements/socialRefinement';

export const socialSchema = z
  .object({
    network: networkNameValidator,
    url: networkUrlValidator,
  })
  .superRefine(socialRefinement);
