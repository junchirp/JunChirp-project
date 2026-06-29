import { ApiProperty } from '@nestjs/swagger';
import { ProjectCardResponseDto } from './project-card.response-dto';
import { ProjectRoleWithUserResponseDto } from '../../project-roles/dto/project-role-with-user.response-dto';
import { UserCardResponseDto } from '../../users/dto/user-card.response-dto';

export class ProjectResponseDto extends ProjectCardResponseDto {
  @ApiProperty({
    example: 'https://discord.gg/qwertyuiop',
    description: 'Discord url',
  })
  public readonly discordUrl: string;

  @ApiProperty({ type: () => [ProjectRoleWithUserResponseDto] })
  public readonly owner: UserCardResponseDto;
}
