import { ApiProperty, OmitType } from '@nestjs/swagger';
import { DocumentResponseDto } from '../../documents/dto/document.response-dto';
import { ProjectCardResponseDto } from './project-card.response-dto';
import { BoardResponseDto } from '../../boards/dto/board.response-dto';
import { ProjectRoleWithUserResponseDto } from '../../project-roles/dto/project-role-with-user.response-dto';

export class ProjectResponseDto extends OmitType(ProjectCardResponseDto, [
  'roles',
]) {
  @ApiProperty({
    example: 'https://discord.gg/qwertyuiop',
    description: 'Discord url',
  })
  public readonly discordUrl: string;

  @ApiProperty({ type: () => [DocumentResponseDto] })
  public readonly documents: DocumentResponseDto[];

  @ApiProperty({ type: () => [BoardResponseDto] })
  public readonly boards: BoardResponseDto[];

  @ApiProperty({ type: () => [ProjectRoleWithUserResponseDto] })
  public readonly roles: ProjectRoleWithUserResponseDto[];
}
