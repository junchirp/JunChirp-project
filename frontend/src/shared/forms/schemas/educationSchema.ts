import { z } from 'zod';
import { institutionValidator } from '@/shared/forms/validators/institutionValidator';
import { nonEmptyValidator } from '@/shared/forms/validators/nonEmptyValidator';

export const educationSchema = z.object({
  institution: institutionValidator,
  specializationId: nonEmptyValidator,
});
