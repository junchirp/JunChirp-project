import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class CursorPaginationDto {
  @ApiProperty({
    example: 20,
    description: 'Number of elements per page',
    default: 20,
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsInt({ message: 'Must be an integer number' })
  @Min(5, { message: 'Minimum allowable value is 5' })
  public readonly limit?: number = 20;

  @ApiProperty({
    example: 123,
    description: 'Pagination cursor',
    required: false,
    type: Number,
  })
  @IsInt({ message: 'Must be an integer number' })
  public readonly cursor?: number;
}
