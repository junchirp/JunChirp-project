import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateTaskStatusDto {
  @ApiProperty({ example: 'To Do', description: 'Status name' })
  @IsString({ message: 'Must be a string' })
  @Length(2, 30, { message: 'Must be between 2 and 30 characters' })
  @IsNotEmpty({ message: 'Status name is required' })
  public readonly statusName: string;
}
