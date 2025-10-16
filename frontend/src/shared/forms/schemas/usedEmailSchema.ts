import { z } from 'zod';
import { usedEmailValidator } from '@/shared/forms/validators/emailValidator';

export const usedEmailSchema = z.object({
  email: usedEmailValidator,
});
