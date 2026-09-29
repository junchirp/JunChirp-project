import { z, ZodArray, ZodString } from 'zod';
import { TFunctionType } from '@/shared/types/t-function.type';

export const desiredRolesValidator = (t: TFunctionType): ZodArray<ZodString> =>
  z
    .array(z.string())
    .min(1, t('errors.nonEmpty'))
    .max(3, t('errors.desiredRolesMax'));
