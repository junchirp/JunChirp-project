import { ConfirmEmailInterface } from './confirm-email.interface';
import { ShortLocaleType } from '../types/short-locale.type';

export interface ConfirmEmailWithLocaleInterface extends ConfirmEmailInterface {
  locale: ShortLocaleType;
}
