import { ApiProperty } from '@nestjs/swagger';

export class EmailResponseDto {
  @ApiProperty({
    example: 'a4d4eb0c-1a10-455e-b9e9-1af147a77762',
    description: 'Unique identifier',
  })
  public readonly id: string;

  @ApiProperty({ example: 'email@mail.com', description: 'Email' })
  public readonly email: string;
}
