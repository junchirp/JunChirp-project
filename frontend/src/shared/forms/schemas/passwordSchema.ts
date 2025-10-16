import { z } from 'zod';
import { passwordValidator } from '@/shared/forms/validators/passwordValidator';
import { nonEmptyValidator } from '@/shared/forms/validators/nonEmptyValidator';

export const passwordSchema = z.object({
  password: passwordValidator,
  confirmPassword: nonEmptyValidator,
});
