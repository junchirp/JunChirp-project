import { ApiProperty } from '@nestjs/swagger';
import { LocaleType } from '../../shared/types/locale.type';

export class ProjectCategoryResponseDto {
  @ApiProperty({
    example: 'a4d4eb0c-1a10-455e-b9e9-1af147a77762',
    description: 'Unique identifier',
  })
  public readonly id: string;

  @ApiProperty({
    example: {
      ua: 'Веб розробка',
      en: 'Web Development',
    },
    description: 'Localized category names',
    additionalProperties: {
      type: 'string',
    },
  })
  public readonly categoryName: Record<LocaleType, string>;
}
