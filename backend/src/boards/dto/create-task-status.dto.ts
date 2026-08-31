import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsUUID } from 'class-validator';
import { localeArray, LocaleType } from '../../common/types/locale.type';

export class CreateTaskStatusDto {
  @ApiProperty({
    example: 'e960a0fb-891a-4f02-9f39-39ac3bb08621',
    description: 'Board id',
  })
  @IsUUID(4, { message: 'Must be a string in UUIDv4 format' })
  @IsNotEmpty({ message: 'Board ID is required' })
  public readonly boardId!: string;

  @ApiProperty({
    example: 'en',
    description: 'Locale',
  })
  @IsIn(localeArray, { message: 'Must be a locale string' })
  public readonly locale!: LocaleType;
}
