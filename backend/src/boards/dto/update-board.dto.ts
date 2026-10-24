import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class UpdateBoardDto {
  @ApiProperty({ example: 'Board name', description: 'Board name' })
  @IsString({ message: 'Must be a string' })
  @Length(2, 50, { message: 'Must be between 2 and 50 characters' })
  @Matches(/^[a-zA-Zа-яА-ЯіІїЇєЄґҐ0-9 _'".,()/+-]+$/, {
    message: 'Board name is incorrect',
  })
  @IsNotEmpty({ message: 'Board name is required' })
  public readonly boardName!: string;
}
