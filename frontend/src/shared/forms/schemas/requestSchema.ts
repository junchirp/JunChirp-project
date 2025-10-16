import { z } from 'zod';
import { nonEmptyValidator } from '@/shared/forms/validators/nonEmptyValidator';

export const requestSchema = z.object({
  projectId: nonEmptyValidator,
  projectRoleId: nonEmptyValidator,
  userId: z.string(),
});
