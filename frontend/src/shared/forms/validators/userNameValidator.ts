import { z, ZodString } from 'zod';

export const userNameValidator = (t: (key: string) => string): ZodString =>
  z
    .string()
    .trim()
    .nonempty(t('errors.nonEmpty'))
    .min(2, t('errors.nameLength'))
    .max(50, t('errors.nameLength'))
    .regex(/^[a-zA-Zа-яА-ЯґҐіІїЇєЄ'’ -]+$/, t('errors.nameSymbols'));
