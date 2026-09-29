import { agreementValidator } from '@/shared/forms/validators/agreementValidator';
import { userNameSchemaBase, userNameSchemaBaseStatic } from './userNameSchema';
import {
  availableEmailSchema,
  availableEmailSchemaStatic,
} from './availableEmailSchema';
import { passwordSchema, passwordSchemaStatic } from './passwordSchema';
import { passwordRefinement } from '@/shared/forms/refinements/passwordRefinement';
import { z, ZodBoolean, ZodObject, ZodString } from 'zod';
import { TFunctionType } from '@/shared/types/t-function.type';

export const registrationSchemaStatic = userNameSchemaBaseStatic
  .extend(availableEmailSchemaStatic.shape)
  .extend(passwordSchemaStatic.shape)
  .extend({
    agreement: z.boolean(),
  });

export const registrationSchema = (
  t: TFunctionType,
): ZodObject<{
  firstName: ZodString;
  lastName: ZodString;
  email: ZodString;
  password: ZodString;
  confirmPassword: ZodString;
  agreement: ZodBoolean;
}> =>
  userNameSchemaBase(t)
    .extend(availableEmailSchema(t).shape)
    .extend(passwordSchema(t).shape)
    .extend({
      agreement: agreementValidator(t),
    })
    .superRefine((data, ctx) => {
      passwordRefinement(t)(
        {
          password: data.password,
          confirmPassword: data.confirmPassword,
          firstName: data.firstName,
          lastName: data.lastName,
        },
        ctx,
      );
    });
