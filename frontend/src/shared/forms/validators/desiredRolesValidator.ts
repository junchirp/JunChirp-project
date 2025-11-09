import { z } from 'zod';

export const desiredRolesValidator = z
  .array(z.string())
  .min(1, 'Поле не може бути порожнім')
  .max(3, 'Можна обрати не більше трьох ролей');
