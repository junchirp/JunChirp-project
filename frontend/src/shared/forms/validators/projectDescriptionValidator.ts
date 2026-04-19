import { z, ZodString } from 'zod';

export const projectDescriptionValidator = (
  t: (key: string) => string,
): ZodString =>
  z
    .string()
    .trim()
    .nonempty(t('errors.nonEmpty'))
    .min(2, t('errors.projectDescriptionLength'))
    .max(500, t('errors.projectDescriptionLength'))
    .regex(
      /^(?!.*\.\.)[A-Za-zА-Яа-яІіЇїЄєҐґ0-9 \-_.',()]+$/,
      t('errors.projectDescriptionSymbols'),
    );
