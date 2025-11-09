import { ApiProperty } from '@nestjs/swagger';
import { ProjectRoleTypeResponseDto } from '../../project-roles/dto/project-role-type.response-dto';

export class UserCardResponseDto {
  @ApiProperty({
    example: 'a4d4eb0c-1a10-455e-b9e9-1af147a77762',
    description: 'Unique identifier',
  })
  public readonly id: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  public readonly firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  public readonly lastName: string;

  @ApiProperty({ example: 'avatar-url', description: 'Avatar URL' })
  public readonly avatarUrl: string;

  @ApiProperty({ example: 2, description: 'Number of active projects' })
  public readonly activeProjectsCount: number;

  @ApiProperty({ example: 5, description: 'Number of done projects' })
  public readonly doneProjectsCount: number;

  @ApiProperty({ type: () => [ProjectRoleTypeResponseDto] })
  public readonly desiredRoles: ProjectRoleTypeResponseDto[];
}
