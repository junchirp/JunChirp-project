import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsUUID } from 'class-validator';
import { localeArray, LocaleType } from '../../shared/types/locale.type';

export class CreateRequestDto {
  @ApiProperty({
    example: '762140ef-5c57-4209-bdb8-d3764e6b95f9',
    description: 'Project id',
  })
  @IsUUID(4, { message: 'Must be a string in UUIDv4 format' })
  @IsNotEmpty({ message: 'Project ID is required' })
  public readonly projectId: string;

  @ApiProperty({
    example: '283816d8-c5f3-45c4-b757-bd1f0357fcc1',
    description: 'Project role id',
  })
  @IsUUID(4, { message: 'Must be a string in UUIDv4 format' })
  @IsNotEmpty({ message: 'Project role ID is required' })
  public readonly projectRoleId: string;

  @ApiProperty({
    example: 'en',
    description: 'Locale',
  })
  @IsIn(localeArray, { message: 'Must be a locale string' })
  public readonly locale: LocaleType;
}
