import { z } from 'zod';
import { hardSkillNameValidator } from '../validators/hardSkillNameValidator';

export const hardSkillSchema = z.object({
  hardSkillName: hardSkillNameValidator,
});
