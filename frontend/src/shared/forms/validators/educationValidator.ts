import { z, ZodString } from 'zod';

export const educationValidator = (t: (key: string) => string): ZodString =>
  z
    .string()
    .trim()
    .nonempty(t('errors.nonEmpty'))
    .min(2, t('errors.educationLength'))
    .max(100, t('errors.educationLength'))
    .regex(
      /^[a-zA-Zа-яА-ЯґҐіІїЇєЄ0-9.'’, &:/“”"-]+$/,
      t('errors.educationSymbols'),
    );
