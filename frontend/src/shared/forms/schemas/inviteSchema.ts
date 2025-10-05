import { z } from 'zod';
import { nonEmptyValidator } from '../validators/nonEmptyValidator';

export const inviteSchema = z.object({
  projectId: nonEmptyValidator,
  projectRoleId: nonEmptyValidator,
  userId: z.string(),
});
