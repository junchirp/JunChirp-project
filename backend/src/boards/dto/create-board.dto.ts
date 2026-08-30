import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsUUID } from 'class-validator';
import { localeArray, LocaleType } from '../../common/types/locale.type';

export class CreateBoardDto {
  @ApiProperty({
    example: 'en',
    description: 'Locale',
  })
  @IsIn(localeArray, { message: 'Must be a locale string' })
  public readonly locale!: LocaleType;

  @ApiProperty({
    example: '47989942-0d09-4834-90c4-3c2954f46d73',
    description: 'Project id',
  })
  @IsUUID(4, { message: 'Must be a string in UUIDv4 format' })
  @IsNotEmpty({ message: 'ID is required' })
  public readonly projectId!: string;
}
