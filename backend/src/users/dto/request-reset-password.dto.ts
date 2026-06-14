import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { localeArray, LocaleType } from '../../shared/types/locale.type';

export class RequestResetPasswordDto {
  @ApiProperty({ example: 'email@mail.com', description: 'Email' })
  public readonly email: string;

  @ApiProperty({
    example: 'en',
    description: 'Locale',
  })
  @IsIn(localeArray, { message: 'Must be a locale string' })
  public readonly locale: LocaleType;
}
