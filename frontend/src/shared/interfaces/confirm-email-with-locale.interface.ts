import { ConfirmEmailInterface } from './confirm-email.interface';
import { Locale } from '../../i18n/routing';

export interface ConfirmEmailWithLocaleInterface extends ConfirmEmailInterface {
  locale: Locale;
}
