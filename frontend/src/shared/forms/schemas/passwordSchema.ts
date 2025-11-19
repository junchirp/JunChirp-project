import { z } from 'zod';
import { passwordValidator } from '@/shared/forms/validators/passwordValidator';
import { nonEmptyValidatorOLD } from '@/shared/forms/validators/nonEmptyValidator';

export const passwordSchema = z.object({
  password: passwordValidator,
  confirmPassword: nonEmptyValidatorOLD,
});
