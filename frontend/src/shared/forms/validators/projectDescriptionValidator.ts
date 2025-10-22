import { z } from 'zod';

export const projectDescriptionValidator = z
  .string()
  .trim()
  .nonempty('Поле не може бути порожнім')
  .min(2, 'Введи опис від 2 до 500 символів')
  .max(500, 'Введи опис від 2 до 500 символів');
