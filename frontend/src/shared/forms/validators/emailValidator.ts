import { z, ZodString } from 'zod';
import { isEmail } from 'validator';
import { TFunctionType } from '@/shared/types/t-function.type';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const basicEmailValidator = (t: TFunctionType): ZodString =>
  z
    .string()
    .trim()
    .nonempty(t('errors.nonEmpty'))
    .min(7, t('errors.length', { min: 7, max: 254 }))
    .max(254, t('errors.length', { min: 7, max: 254 }))
    .refine((val) => isEmail(val), {
      message: t('errors.emailFormat'),
    })
    .regex(/^(?!.*[а-яА-ЯґҐіІєЄїЇ])/, t('errors.invalidCharacters'));

export const forbiddenDomainValidator = (t: TFunctionType): ZodString => {
  const base = basicEmailValidator(t);

  return base.refine((val) => !val.endsWith('.ru'), {
    message: t('errors.emailDomain'),
  });
};

export const availableEmailValidator = (t: TFunctionType): ZodString => {
  const base = forbiddenDomainValidator(t);

  return base.refine(
    async (val) => {
      try {
        const res = await fetch(
          `${BASE_URL}/auth/check-email?email=${encodeURIComponent(val)}`,
        );

        if (!res.ok) {
          return true;
        }

        const { isAvailable } = await res.json();
        return isAvailable;
      } catch {
        return true;
      }
    },
    {
      message: t('errors.emailTaken'),
    },
  );
};
