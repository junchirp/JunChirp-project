import { z } from 'zod';

export const hardSkillNameValidator = z
  .string()
  .trim()
  .nonempty('Поле не може бути порожнім')
  .min(2, 'Введи Hard Skill від 2 до 50 символів')
  .max(50, 'Введи Hard Skill від 2 до 50 символів')
  .regex(/^[A-Za-zА-Яа-яІіЇїЄєҐґ0-9 .'\-+_/]+$/, 'Недопустимі символи в назві');
