import { z, ZodString } from 'zod';

export const hardSkillNameValidator = (t: (key: string) => string): ZodString =>
  z
    .string()
    .trim()
    .nonempty(t('errors.nonEmpty'))
    .min(2, t('errors.skillLength'))
    .max(50, t('errors.skillLength'))
    .regex(/^[A-Za-zА-Яа-яІіЇїЄєҐґ0-9 .'\-+_/]+$/, t('errors.nameSymbols'));
