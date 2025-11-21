import { ZodObject, ZodString } from 'zod';
import { passwordSchema } from './passwordSchema';
import { passwordRefinement } from '@/shared/forms/refinements/passwordRefinement';

export const resetPasswordSchema = (
  t: (key: string) => string,
  firstName: string,
  lastName: string,
): ZodObject<{ password: ZodString; confirmPassword: ZodString }> =>
  passwordSchema(t).superRefine((data, ctx) =>
    passwordRefinement(t)(
      {
        password: data.password,
        confirmPassword: data.confirmPassword,
        firstName,
        lastName,
      },
      ctx,
    ),
  );
