import { Locale } from '../../i18n/routing';

export interface CreateSupportInterface {
  email: string;
  requestText: string;
  requestHtml: string;
  locale: Locale;
}
