import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUrl } from 'class-validator';

export class CloseProjectDto {
  @ApiProperty({
    example: 'en',
    description: 'Locale',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
  })
  public readonly publicUrl?: string;
}
