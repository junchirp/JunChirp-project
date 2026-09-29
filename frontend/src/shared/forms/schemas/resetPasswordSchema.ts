import { ZodObject, ZodString } from 'zod';
import { passwordSchema } from './passwordSchema';
import { passwordRefinement } from '@/shared/forms/refinements/passwordRefinement';
import { TFunctionType } from '@/shared/types/t-function.type';

export const resetPasswordSchema = (
  t: TFunctionType,
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
