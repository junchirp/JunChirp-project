import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { localeArray, LocaleType } from '../../shared/types/locale.type';
import { ConfirmEmailDto } from './confirm-email.dto';

export class ConfirmEmailWithLocaleDto extends ConfirmEmailDto {
  @ApiProperty({
    example: 'en',
    description: 'Locale',
  })
  @IsIn(localeArray, { message: 'Must be a locale string' })
  public readonly locale: LocaleType;
}
