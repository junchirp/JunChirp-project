import { z } from 'zod';
import { networkNameValidator } from '../validators/networkNameValidator';
import { networkUrlValidator } from '../validators/networkUrlValidator';
import { socialRefinement } from '../refinements/socialRefinement';

export const socialSchema = z
  .object({
    network: networkNameValidator,
    url: networkUrlValidator,
  })
  .superRefine(socialRefinement);
