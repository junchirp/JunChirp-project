import { ApiProperty } from '@nestjs/swagger';

export class ProjectLogoResponseDto {
  @ApiProperty({
    example: 'a4d4eb0c-1a10-455e-b9e9-1af147a77762',
    description: 'Unique identifier',
  })
  public readonly id: string;

  @ApiProperty({
    example: 'logo-url',
    description: 'Project logo url',
  })
  public readonly url: string;

  @ApiProperty({
    example: 800,
    description: 'Project logo width',
  })
  public readonly width: number;

  @ApiProperty({
    example: 800,
    description: 'Project logo height',
  })
  public readonly height: number;
}
