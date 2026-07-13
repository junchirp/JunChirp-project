import { ProjectCategory, ProjectCategoryTranslation } from '@prisma/client';
import { ProjectCategoryResponseDto } from '../../projects/dto/project-category.response-dto';

export class ProjectCategoryMapper {
  public static toResponse(
    category: ProjectCategory & {
      translations: ProjectCategoryTranslation[];
    },
  ): ProjectCategoryResponseDto {
    return {
      id: category.id,
      categoryName: category.translations.reduce<Record<string, string>>(
        (acc, t) => {
          acc[t.locale] = t.categoryName;
          return acc;
        },
        {},
      ),
    };
  }
}
