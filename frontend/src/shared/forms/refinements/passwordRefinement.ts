import { z } from 'zod';
import { blackListPasswords } from '../../constants/black-list-passwords';

interface PasswordCheckData {
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
}

export const passwordRefinement = (
  {
    password,
    firstName = '',
    lastName = '',
    confirmPassword,
  }: PasswordCheckData,
  ctx: z.RefinementCtx,
): void => {
  if (password.includes(firstName) && firstName.length) {
    ctx.addIssue({
      path: ['password'],
      code: 'custom',
      message: `Пароль не може містити твоє ім'я чи прізвище`,
    });
  }

  if (password.includes(lastName) && lastName.length) {
    ctx.addIssue({
      path: ['password'],
      code: 'custom',
      message: `Пароль не може містити твоє ім'я чи прізвище`,
    });
  }

  if (blackListPasswords.includes(password)) {
    ctx.addIssue({
      path: ['password'],
      code: 'custom',
      message: 'Уникай занадто простих або очевидних паролів',
    });
  }

  if (password !== confirmPassword) {
    ctx.addIssue({
      path: ['confirmPassword'],
      code: 'custom',
      message: 'Паролі не збігаються',
    });
  }
};
