import { z, ZodString } from 'zod';
import { isEmail } from 'validator';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const basicEmailValidator = (t: (key: string) => string): ZodString =>
  z
    .string()
    .trim()
    .nonempty(t('errors.nonEmpty'))
    .min(7, t('errors.emailLength'))
    .max(254, t('errors.emailLength'))
    .refine((val) => isEmail(val), {
      message: t('errors.emailFormat'),
    })
    .regex(/^(?!.*[а-яА-ЯґҐіІєЄїЇ])/, t('errors.emailFormat'));

export const forbiddenDomainValidator = (
  t: (key: string) => string,
): ZodString => {
  const base = basicEmailValidator(t);

  return base.refine((val) => !val.endsWith('.ru'), {
    message: t('errors.emailDomain'),
  });
};

export const availableEmailValidator = (
  t: (key: string) => string,
): ZodString => {
  const base = forbiddenDomainValidator(t);

  return base.refine(
    async (val) => {
      try {
        const res = await fetch(
          `${BASE_URL}/users/check-email?email=${encodeURIComponent(val)}`,
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

export const usedEmailValidator = (t: (key: string) => string): ZodString => {
  const base = forbiddenDomainValidator(t);

  return base.refine(
    async (val) => {
      try {
        const res = await fetch(
          `${BASE_URL}/users/check-email?email=${encodeURIComponent(val)}`,
        );

        if (!res.ok) {
          return true;
        }

        const { isAvailable } = await res.json();
        return !isAvailable;
      } catch {
        return true;
      }
    },
    {
      message: t('errors.emailNotFound'),
    },
  );
};
