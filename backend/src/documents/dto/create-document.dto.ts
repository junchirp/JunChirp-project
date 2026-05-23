import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, IsUUID, Length, Matches } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({ example: 'Document name', description: 'Document name' })
  @IsString({ message: 'Must be a string' })
  @Length(2, 100, { message: 'Must be between 2 and 100 characters' })
  @IsNotEmpty({ message: 'Document name is required' })
  @Matches(/^[A-Za-zА-Яа-яІіЇїЄєҐґ0-9 \-.,_()/+]+$/, {
    message: 'Document name is incorrect',
  })
  public readonly documentName: string;

  @ApiProperty({
    example: 'https://document.url',
    description: 'Document url',
  })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty({ message: 'Document url is required' })
  @Length(10, 255, { message: 'Must be between 10 and 255 characters' })
  @Matches(/^https:\/\/.{2,247}$/, {
    message: 'Document url is incorrect',
  })
  @IsUrl(
    { require_protocol: true },
    { message: 'URL must include protocol (http/https)' },
  )
  public readonly url: string;

  @ApiProperty({
    example: 'e960a0fb-891a-4f02-9f39-39ac3bb08621',
    description: 'Project id',
  })
  @IsUUID(4, { message: 'Must be a string in UUIDv4 format' })
  @IsNotEmpty({ message: 'Project ID is required' })
  public readonly projectId: string;
}
