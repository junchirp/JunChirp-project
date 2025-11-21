import { z } from 'zod';
import { blackListPasswords } from '@/shared/constants/black-list-passwords';

interface PasswordCheckData {
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
}

export const passwordRefinement =
  (t: (key: string) => string) =>
  (
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
        message: t('errors.passwordIncludes'),
      });
    }

    if (password.includes(lastName) && lastName.length) {
      ctx.addIssue({
        path: ['password'],
        code: 'custom',
        message: t('errors.passwordIncludes'),
      });
    }

    if (blackListPasswords.includes(password)) {
      ctx.addIssue({
        path: ['password'],
        code: 'custom',
        message: t('errors.blackList'),
      });
    }

    if (password !== confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        code: 'custom',
        message: t('errors.confirmPassword'),
      });
    }
  };
