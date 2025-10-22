import { z } from 'zod';

export const projectNameValidator = z
  .string()
  .trim()
  .nonempty('Поле не може бути порожнім')
  .min(2, 'Введи назву від 2 до 50 символів')
  .max(50, 'Введи назву від 2 до 50 символів');
