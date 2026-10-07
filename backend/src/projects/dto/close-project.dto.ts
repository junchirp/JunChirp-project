import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUrl, Length } from 'class-validator';

export class CloseProjectDto {
  @ApiProperty({
    example: 'https://www.public-url.com',
    description: 'Public url',
    required: false,
    type: String,
  })
  @IsOptional()
  @Length(10, 255, { message: 'Must be between 10 and 255 characters' })
  @IsUrl(
    {
      protocols: ['https'],
      require_protocol: true,
    },
    { message: 'URL must include protocol (http/https)' },
  )
  public readonly publicUrl?: string;
}
