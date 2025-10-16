import { z } from 'zod';
import { softSkillNameValidator } from '@/shared/forms/validators/softSkillNameValidator';

export const softSkillSchema = z.object({
  softSkillName: softSkillNameValidator,
});
