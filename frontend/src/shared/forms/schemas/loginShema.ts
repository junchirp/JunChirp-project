import { z } from 'zod';
import { nonEmptyValidator } from '../validators/nonEmptyValidator';

export const loginSchema = z.object({
  email: nonEmptyValidator,
  password: nonEmptyValidator,
});
