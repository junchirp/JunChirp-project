import { z } from 'zod';
import { availableEmailValidator } from '../validators/emailValidator';

export const availableEmailSchema = z.object({
  email: availableEmailValidator,
});
