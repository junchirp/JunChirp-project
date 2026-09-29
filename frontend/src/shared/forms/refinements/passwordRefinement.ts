import { z } from 'zod';
import { blackListPasswords } from '@/shared/constants/black-list-passwords';
import { TFunctionType } from '@/shared/types/t-function.type';

interface PasswordCheckData {
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
}

export const passwordRefinement =
  (t: TFunctionType) =>
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
