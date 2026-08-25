import { ApiProperty } from '@nestjs/swagger';
import { ProjectCardResponseDto } from './project-card.response-dto';
import { UserBaseResponseDto } from '../../users/dto/user-base.response-dto';
import { MyParticipationResponseDto } from '../../participations/dto/my-participation.response-dto';

export class ProjectResponseDto extends ProjectCardResponseDto {
  @ApiProperty({
    example: 'https://discord.gg/qwertyuiop',
    description: 'Discord url',
  })
  public readonly discordUrl: string;

  @ApiProperty({ type: () => UserBaseResponseDto })
  public readonly owner: UserBaseResponseDto;

  @ApiProperty({ type: () => MyParticipationResponseDto, nullable: true })
  public readonly myParticipation: MyParticipationResponseDto | null;
}
