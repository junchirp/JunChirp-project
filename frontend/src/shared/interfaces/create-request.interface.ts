import { SystemLocaleType } from '../types/system-locale.type';

export interface CreateRequestInterface {
  projectId: string;
  projectRoleId: string;
  locale: SystemLocaleType;
}
