import { SystemLocaleType } from '../types/system-locale.type';

export interface CreateSupportInterface {
  email: string;
  requestText: string;
  requestHtml: string;
  locale: SystemLocaleType;
}
