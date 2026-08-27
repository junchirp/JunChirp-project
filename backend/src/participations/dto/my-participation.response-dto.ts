import { ApiProperty } from '@nestjs/swagger';
import { ProjectRoleResponseDto } from '../../project-roles/dto/project-role.response-dto';
import { ParticipationType } from '../../common/types/participation.type';

export class MyParticipationResponseDto {
  @ApiProperty({
    example: 'a4d4eb0c-1a10-455e-b9e9-1af147a77762',
    description: 'Unique identifier',
  })
  public readonly id: string;

  @ApiProperty({
    example: 'request',
    description: 'Participation type',
  })
  public readonly type: ParticipationType;

  @ApiProperty({ type: () => ProjectRoleResponseDto })
  public readonly projectRole: ProjectRoleResponseDto;
}
