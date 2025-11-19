import { z, ZodString } from 'zod';

export const nonEmptyValidator = (t: (key: string) => string): ZodString =>
  z.string().nonempty(t('errors.nonEmpty'));

export const nonEmptyValidatorOLD = z
  .string()
  .nonempty('Поле не може бути порожнім');
