import { z } from 'zod';

export const requestSchemaStatic = z.object({
  projectId: z.uuidv4(),
  projectRoleId: z.uuidv4(),
  userId: z.uuidv4(),
});

export const requestSchema = requestSchemaStatic;
