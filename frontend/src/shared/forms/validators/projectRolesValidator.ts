import { z } from 'zod';

export const projectRolesValidator = z.array(z.string());
