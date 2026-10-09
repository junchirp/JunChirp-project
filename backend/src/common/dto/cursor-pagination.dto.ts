import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class CursorPaginationDto {
  @ApiProperty({
    example: 20,
    description: 'Number of elements per page',
  })
  @IsInt({ message: 'Must be an integer number' })
  @Min(20, { message: 'Minimum allowable value is 20' })
  public readonly limit!: number;

  @ApiProperty({
    example: 123,
    description: 'Pagination cursor',
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsInt({ message: 'Must be an integer number' })
  public readonly cursor?: number;
}
