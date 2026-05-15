import { SystemLocaleType } from '../types/system-locale.type';

export interface RegistrationInterface {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  locale: SystemLocaleType;
}
