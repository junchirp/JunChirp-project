import { ApiProperty } from '@nestjs/swagger';

export class CountResponseDto {
  @ApiProperty({
    example: 2,
    description: 'Items count',
  })
  public readonly count: number;
}
