import { z, ZodString } from 'zod';
import { TFunctionType } from '@/shared/types/t-function.type';

export const nonEmptyValidator = (t: TFunctionType): ZodString =>
  z.string().nonempty(t('errors.nonEmpty'));
