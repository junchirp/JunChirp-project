import { z } from 'zod';
import { hardSkillNameValidator } from '@/shared/forms/validators/hardSkillNameValidator';

export const hardSkillSchema = z.object({
  hardSkillName: hardSkillNameValidator,
});
