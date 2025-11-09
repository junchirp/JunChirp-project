import { z } from 'zod';

export const networkUrlValidator = z
  .string()
  .trim()
  .nonempty('Поле не може бути порожнім')
  .min(10, 'Урл повинен містити від 10 до 255 символів')
  .max(255, 'Урл повинен містити від 10 до 255 символів');
