import { z } from 'zod';
import { passwordValidator } from '../validators/passwordValidator';
import { nonEmptyValidator } from '../validators/nonEmptyValidator';

export const passwordSchema = z.object({
  password: passwordValidator,
  confirmPassword: nonEmptyValidator,
});
