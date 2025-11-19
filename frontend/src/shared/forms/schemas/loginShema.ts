import { z } from 'zod';
import { nonEmptyValidatorOLD } from '@/shared/forms/validators/nonEmptyValidator';
import { basicEmailValidator } from '@/shared/forms/validators/emailValidator';

export const loginSchema = z.object({
  email: basicEmailValidator,
  password: nonEmptyValidatorOLD,
});
