import { ZodObject, ZodString } from 'zod';
import { passwordSchema } from './passwordSchema';
import { passwordRefinement } from '@/shared/forms/refinements/passwordRefinement';

export const resetPasswordSchema = (
  firstName: string,
  lastName: string,
): ZodObject<{ password: ZodString; confirmPassword: ZodString }> =>
  passwordSchema.superRefine(({ password, confirmPassword }, ctx) =>
    passwordRefinement(
      {
        password,
        firstName,
        lastName,
        confirmPassword,
      },
      ctx,
    ),
  );
