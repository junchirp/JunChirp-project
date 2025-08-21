import { z } from 'zod';
import { userNameValidator } from '../validators/userNameValidator';

export const userNameSchema = z.object({
  firstName: userNameValidator,
  lastName: userNameValidator,
});
