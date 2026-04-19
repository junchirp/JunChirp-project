import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsUUID, Length, Matches } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Project name', description: 'Project name' })
  @IsString({ message: 'Must be a string' })
  @Length(2, 50, { message: 'Must be between 2 and 50 characters' })
  @IsNotEmpty({ message: 'Project name is required' })
  @Matches(/^(?!.*\.\.)[A-Za-zА-Яа-яІіЇїЄєҐґ0-9 \-_.',()]+$/, {
    message: 'Project name is incorrect',
  })
  public readonly projectName: string;

  @ApiProperty({
    example: 'Project description',
    description: 'Project description',
  })
  @IsString({ message: 'Must be a string' })
  @Length(2, 500, { message: 'Must be between 2 and 500 characters' })
  @IsNotEmpty({ message: 'Project description is required' })
  @Matches(/^(?!.*\.\.)[A-Za-zА-Яа-яІіЇїЄєҐґ0-9 \-_.',()]+$/, {
    message: 'Project description is incorrect',
  })
  public readonly description: string;

  @ApiProperty({
    example: 'e960a0fb-891a-4f02-9f39-39ac3bb08621',
    description: 'Category id',
  })
  @IsUUID(4, { message: 'Must be a string in UUIDv4 format' })
  @IsNotEmpty({ message: 'Category ID is required' })
  public readonly categoryId: string;

  @ApiProperty({
    example: ['e960a0fb-891a-4f02-9f39-39ac3bb08621'],
    description: 'Role types IDs',
  })
  @IsArray({ message: 'Must be an array of IDs' })
  @IsUUID(4, { message: 'Must be a string in UUIDv4 format', each: true })
  @IsNotEmpty({ message: 'Role type ID is required', each: true })
  public readonly rolesIds: string[];
}
