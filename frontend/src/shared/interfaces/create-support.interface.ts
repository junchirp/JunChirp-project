import { ShortLocaleType } from '../types/short-locale.type';

export interface CreateSupportInterface {
  email: string;
  requestText: string;
  requestHtml: string;
  locale: ShortLocaleType;
}
