import { z } from 'zod';

export const networkNameValidator = z
  .string()
  .trim()
  .nonempty('Поле не може бути порожнім')
  .min(2, 'Назва повинна містити від 2 до 50 символів')
  .max(50, 'Назва повинна містити від 2 до 50 символів')
  .regex(/^[a-zA-Zа-яА-ЯґҐїЇєЄ' -]+$/, 'Некоректна назва соцмережі');
