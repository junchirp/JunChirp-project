import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { localeArray, LocaleType } from '../types/locale.type';

export class LocaleDto {
  @ApiProperty({
    example: 'en',
    description: 'Locale',
  })
  @IsIn(localeArray, { message: 'Must be a locale string' })
  public readonly locale: LocaleType;
}
