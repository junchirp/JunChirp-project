import { ApiProperty } from '@nestjs/swagger';

export class DeveloperResponseDto {
  @ApiProperty({
    example: 'a4d4eb0c-1a10-455e-b9e9-1af147a77762',
    description: 'Unique identifier',
  })
  public readonly id!: string;

  @ApiProperty({
    example: 'developerNameKey',
    description: 'Developer name key',
  })
  public readonly developerName!: string;

  @ApiProperty({ example: 'descriptionKey', description: 'Description key' })
  public readonly description!: string;

  @ApiProperty({ example: 'photo-url', description: 'Photo URL' })
  public readonly photoUrl!: string;

  @ApiProperty({
    example: 'https//:linkedin.com',
    description: 'LinkedIn profile URL',
  })
  public readonly linkedinUrl!: string;

  @ApiProperty({ example: 'UI/UX Designer', description: `Developer's role` })
  public readonly role!: string;

  @ApiProperty({
    example: 'a4d4eb0c-1a10-455e-b9e9-1af147a77762',
    description: `Developer's ID on the JunChirp platform`,
  })
  public readonly userId!: string;
}
