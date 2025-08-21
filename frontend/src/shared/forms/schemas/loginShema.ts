import { z } from 'zod';
import { nonEmptyValidator } from '../validators/nonEmptyValidator';
import { basicEmailValidator } from '../validators/emailValidator';

export const loginSchema = z.object({
  email: basicEmailValidator,
  password: nonEmptyValidator,
});
