import { ShortLocaleType } from '../types/short-locale.type';

export interface ProjectCategoryInterface {
  id: string;
  categoryName: Record<ShortLocaleType, string>;
}
