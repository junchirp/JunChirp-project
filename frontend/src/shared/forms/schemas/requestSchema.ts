import { z } from 'zod';
import { nonEmptyValidator } from '../validators/nonEmptyValidator';

export const requestSchema = z.object({
  projectId: nonEmptyValidator,
  projectRoleId: nonEmptyValidator,
  userId: z.string(),
});
