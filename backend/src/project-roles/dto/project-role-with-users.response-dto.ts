import { ProjectRoleResponseDto } from './project-role.response-dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserBaseResponseDto } from '../../users/dto/user-base.response-dto';

export class ProjectRoleWithUsersResponseDto extends ProjectRoleResponseDto {
  @ApiProperty({ type: () => [UserBaseResponseDto] })
  public readonly users!: UserBaseResponseDto[];
}
