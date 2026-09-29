import { z, ZodBoolean } from 'zod';
import { TFunctionType } from '@/shared/types/t-function.type';

export const agreementValidator = (t: TFunctionType): ZodBoolean =>
  z.boolean().refine((val) => val, {
    message: t('errors.agreement'),
  });
