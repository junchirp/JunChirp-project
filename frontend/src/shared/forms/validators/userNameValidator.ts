import { z } from 'zod';

export const userNameValidator = z
  .string()
  .trim()
  .nonempty('Поле не може бути порожнім')
  .min(2, 'Введи від 2 до 50 літер')
  .max(50, 'Введи від 2 до 50 літер')
  .regex(
    /^[a-zA-Zа-яА-ЯґҐіІїЇєЄ'’ -]+$/,
    'Допустимі літери, пробіли, апострофи та дефіси',
  );
