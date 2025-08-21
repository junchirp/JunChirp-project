import { z } from 'zod';

export const nonEmptyValidator = z
  .string()
  .nonempty('Поле не може бути порожнім');
