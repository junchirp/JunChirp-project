import { Locale } from '@/i18n/routing';

export interface RegistrationInterface {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  locale: Locale;
}
