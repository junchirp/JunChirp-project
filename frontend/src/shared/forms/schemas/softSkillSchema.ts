import { z } from 'zod';
import { softSkillNameValidator } from '../validators/softSkillNameValidator';

export const softSkillSchema = z.object({
  softSkillName: softSkillNameValidator,
});
