import { z } from 'zod';
import { institutionValidator } from '../validators/institutionValidator';
import { nonEmptyValidator } from '../validators/nonEmptyValidator';

export const educationSchema = z.object({
  institution: institutionValidator,
  specializationId: nonEmptyValidator,
});
