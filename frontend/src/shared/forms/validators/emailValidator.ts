import { z } from 'zod';
import { isEmail } from 'validator';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const basicEmailValidator = z
  .string()
  .trim()
  .nonempty('Поле не може бути порожнім')
  .min(7, 'E-mail має містити 7–254 символи')
  .max(254, 'E-mail має містити 7–254 символи')
  .refine((val) => isEmail(val), {
    message: 'Невірний формат e-mail',
  })
  .regex(/^(?!.*[а-яА-ЯґҐіІєЄїЇ])/, 'Невірний формат e-mail');

export const availableEmailValidator = basicEmailValidator.refine(
  async (val) => {
    try {
      const res = await fetch(
        `${BASE_URL}/users/check-email?email=${encodeURIComponent(val)}`,
      );
      if (!res.ok) {
        return true;
      }

      const { isAvailable } = await res.json();
      return isAvailable;
    } catch {
      return true;
    }
  },
  {
    message: 'Цей e-mail вже використовується',
  },
);

export const usedEmailValidator = basicEmailValidator.refine(
  async (val) => {
    try {
      const res = await fetch(
        `${BASE_URL}/users/check-email?email=${encodeURIComponent(val)}`,
      );
      if (!res.ok) {
        return true;
      }

      const { isAvailable } = await res.json();
      return !isAvailable;
    } catch {
      return true;
    }
  },
  {
    message: 'Електронна пошта не знайдена',
  },
);
