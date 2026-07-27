import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateBoardDto {
  @ApiProperty({ example: 'Board name', description: 'Board name' })
  @IsString({ message: 'Must be a string' })
  @Length(2, 50, { message: 'Must be between 2 and 50 characters' })
  @IsNotEmpty({ message: 'Board name is required' })
  public readonly boardName: string;
}
