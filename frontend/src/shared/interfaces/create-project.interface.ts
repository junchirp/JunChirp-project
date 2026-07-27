import { ShortLocaleType } from '@/shared/types/short-locale.type';

export interface CreateProjectInterface {
  projectName: string;
  description: string;
  categoryId: string;
  rolesIds: string[];
  locale: ShortLocaleType;
}
