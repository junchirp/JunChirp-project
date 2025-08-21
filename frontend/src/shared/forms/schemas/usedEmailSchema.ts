import { z } from 'zod';
import { usedEmailValidator } from '../validators/emailValidator';

export const usedEmailSchema = z.object({
  email: usedEmailValidator,
});
