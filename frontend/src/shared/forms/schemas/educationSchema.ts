import { z } from 'zod';
import { educationValidator } from '../validators/educationValidator';

export const educationSchema = z.object({
  institution: educationValidator,
  specialization: educationValidator,
});
