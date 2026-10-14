import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class CursorPaginationDto {
  @ApiProperty({
    example: 20,
    description: 'Number of elements per page',
  })
  @IsInt({ message: 'Must be an integer number' })
  @Min(20, { message: 'Minimum allowable value is 20' })
  public readonly limit!: number;

  @ApiProperty({
    example: 'e960a0fb-891a-4f02-9f39-39ac3bb08621',
    description: 'Pagination cursor (task id)',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsUUID(4, { message: 'Must be a string in UUIDv4 format' })
  public readonly cursor?: string;
}
