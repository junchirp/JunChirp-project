import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';
import { TaskPriority } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsFutureDate } from '../../common/validators/is-future-date.validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Task name', description: 'Task name' })
  @IsString({ message: 'Must be a string' })
  @Length(2, 100, { message: 'Must be between 2 and 100 characters' })
  @Matches(/^[A-Za-zА-Яа-яІіЇїЄєҐґ0-9 \-+/_.'"«»,()]+$/, {
    message: 'Contains invalid characters',
  })
  @IsNotEmpty({ message: 'Task name is required' })
  public readonly taskName!: string;

  @ApiProperty({
    example: 'Task description',
    description: 'Task description',
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Must be a string' })
  @Length(2, 1000, { message: 'Must be between 2 and 1000 characters' })
  @Matches(/^[A-Za-zА-Яа-яІіЇїЄєҐґ0-9 \-+/_.'"«»,()]+$/, {
    message: 'Contains invalid characters',
  })
  public readonly description!: string | null;

  @ApiProperty({
    example: 'high',
    description: 'Task priority',
  })
  @IsIn(['critical', 'high', 'medium', 'low'], {
    message: 'Value must be "high", "normal" or "low"',
  })
  @IsNotEmpty({ message: 'Task priority is required' })
  public readonly priority!: TaskPriority;

  @ApiProperty({
    example: '2025-04-11T11:51:05.224',
    description: 'Task deadline',
    nullable: true,
    type: Date,
  })
  @IsOptional()
  @IsDate({ message: 'Must be a valid date' })
  @IsFutureDate()
  @Type(() => Date)
  public readonly deadline: Date | null;

  @ApiProperty({
    example: 'e960a0fb-891a-4f02-9f39-39ac3bb08621',
    description: 'Task status id',
  })
  @IsUUID(4, { message: 'Must be a string in UUIDv4 format' })
  @IsNotEmpty({ message: 'Column id ID is required' })
  public readonly taskStatusId!: string;

  @ApiProperty({
    example: ['e960a0fb-891a-4f02-9f39-39ac3bb08621'],
    description: 'Users IDs',
  })
  @IsArray({ message: 'Must be an array of IDs' })
  @IsUUID(4, { message: 'Must be a string in UUIDv4 format', each: true })
  @IsNotEmpty({ message: 'User ID is required', each: true })
  public readonly assigneesIds!: string[];
}
