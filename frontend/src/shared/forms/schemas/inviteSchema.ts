import { z } from 'zod';

export const inviteSchemaStatic = z.object({
  projectId: z.uuidv4(),
  projectRoleId: z.uuidv4(),
  userId: z.uuidv4(),
});

export const inviteSchema = inviteSchemaStatic;
