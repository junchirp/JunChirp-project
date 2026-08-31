import { ApiProperty } from '@nestjs/swagger';
import { ProjectCardExpandedResponseDto } from './project-card-expanded.response-dto';

export class ProjectsListResponseDto {
  @ApiProperty({
    example: 43,
    description: 'Total number of projects',
  })
  public readonly total!: number;

  @ApiProperty({ type: () => [ProjectCardExpandedResponseDto] })
  public readonly projects!: ProjectCardExpandedResponseDto[];
}
