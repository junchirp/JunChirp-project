import { CreateRequestInterface } from './create-request.interface';
import { Locale } from '@/i18n/routing';

export interface CreateInviteInterface extends CreateRequestInterface {
  userId: string;
  locale: Locale;
}
