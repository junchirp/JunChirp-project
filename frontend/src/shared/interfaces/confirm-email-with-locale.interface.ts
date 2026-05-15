import { ConfirmEmailInterface } from './confirm-email.interface';
import { SystemLocaleType } from '../types/system-locale.type';

export interface ConfirmEmailWithLocaleInterface extends ConfirmEmailInterface {
  locale: SystemLocaleType;
}
