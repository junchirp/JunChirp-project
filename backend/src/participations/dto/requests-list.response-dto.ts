import { ApiProperty } from '@nestjs/swagger';
import { ProjectParticipationResponseDto } from './project-participation.response-dto';

export class RequestsListResponseDto {
  @ApiProperty({
    example: 43,
    description: 'Total number of requests',
  })
  public readonly total!: number;

  @ApiProperty({ type: () => [ProjectParticipationResponseDto] })
  public readonly requests!: ProjectParticipationResponseDto[];
}
