import { z } from 'zod';
import { userNameValidator } from '@/shared/forms/validators/userNameValidator';
import { desiredRolesValidator } from '../validators/desiredRolesValidator';

export const userNameSchema = z.object({
  firstName: userNameValidator,
  lastName: userNameValidator,
  desiredRolesIds: desiredRolesValidator,
});
