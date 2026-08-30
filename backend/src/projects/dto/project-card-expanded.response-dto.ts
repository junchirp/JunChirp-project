import { ApiProperty } from '@nestjs/swagger';
import { MyParticipationResponseDto } from '../../participations/dto/my-participation.response-dto';
import { ProjectCardResponseDto } from './project-card.response-dto';

export class ProjectCardExpandedResponseDto extends ProjectCardResponseDto {
  @ApiProperty({ type: () => MyParticipationResponseDto, nullable: true })
  public readonly myParticipation!: MyParticipationResponseDto | null;
}
