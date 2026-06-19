import { ShortLocaleType } from '../types/short-locale.type';

export interface CreateRequestInterface {
  projectId: string;
  projectRoleId: string;
  locale: ShortLocaleType;
}
