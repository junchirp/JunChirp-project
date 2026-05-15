import { SystemLocaleType } from '../types/system-locale.type';

export interface ProjectCategoryInterface {
  id: string;
  categoryName: Record<SystemLocaleType, string>;
}
