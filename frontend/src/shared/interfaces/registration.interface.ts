import { ShortLocaleType } from '../types/short-locale.type';

export interface RegistrationInterface {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  locale: ShortLocaleType;
}
