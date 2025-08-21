import { agreementValidator } from '../validators/agreementValidator';
import { userNameSchema } from './userNameSchema';
import { availableEmailSchema } from './availableEmailSchema';
import { passwordSchema } from './passwordSchema';
import { passwordRefinement } from '../refinements/passwordRefinement';

export const registrationSchema = userNameSchema
  .extend(availableEmailSchema.shape)
  .extend(passwordSchema.shape)
  .extend({
    agreement: agreementValidator,
  })
  .superRefine(passwordRefinement);
