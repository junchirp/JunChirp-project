import { ApiProperty } from '@nestjs/swagger';
import { ProjectParticipationResponseDto } from './project-participation.response-dto';

export class InvitesListResponseDto {
  @ApiProperty({
    example: 43,
    description: 'Total number of invites',
  })
  public readonly total!: number;

  @ApiProperty({ type: () => [ProjectParticipationResponseDto] })
  public readonly invites!: ProjectParticipationResponseDto[];
}
