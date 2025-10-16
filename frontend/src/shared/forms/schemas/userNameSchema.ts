import { z } from 'zod';
import { userNameValidator } from '@/shared/forms/validators/userNameValidator';

export const userNameSchema = z.object({
  firstName: userNameValidator,
  lastName: userNameValidator,
});
