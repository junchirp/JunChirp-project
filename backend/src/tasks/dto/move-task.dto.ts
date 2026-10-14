import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class MoveTaskDto {
  @ApiProperty({ example: 7, description: 'Old task index' })
  @IsInt({ message: 'Must be an integer number' })
  @Min(1, { message: 'Number must be positive integer' })
  @IsNotEmpty({ message: 'Task index is required' })
  public readonly oldIndex!: number;

  @ApiProperty({
    example: 'e960a0fb-891a-4f02-9f39-39ac3bb08621',
    description: 'Old column id',
  })
  @IsUUID(4, { message: 'Must be a string in UUIDv4 format' })
  @IsNotEmpty({ message: 'Column id ID is required' })
  public readonly oldColumnId!: string;

  @ApiProperty({ example: 7, description: 'New task index' })
  @IsInt({ message: 'Must be an integer number' })
  @Min(1, { message: 'Number must be positive integer' })
  @IsNotEmpty({ message: 'Task index is required' })
  public readonly newIndex!: number;

  @ApiProperty({
    example: 'e960a0fb-891a-4f02-9f39-39ac3bb08621',
    description: 'New column id',
  })
  @IsUUID(4, { message: 'Must be a string in UUIDv4 format' })
  @IsNotEmpty({ message: 'Column id ID is required' })
  public readonly newColumnId!: string;
}
