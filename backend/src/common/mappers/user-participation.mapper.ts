import { ProjectRole, ProjectRoleType, User } from '@prisma/client';
import { UserParticipationResponseDto } from '../../participations/dto/user-participation.response-dto';
import { UserMapper } from './user.mapper';
import { ProjectRoleMapper } from './project-role.mapper';
import { ParticipationModelType } from '../types/participation-model.type';

export class UserParticipationMapper {
  public static toResponse(
    participation: ParticipationModelType & {
      user: User & {
        desiredRoles: ProjectRoleType[];
      };
      projectRole: ProjectRole & { roleType: ProjectRoleType };
    },
  ): UserParticipationResponseDto {
    return {
      id: participation.id,
      createdAt: participation.createdAt,
      user: UserMapper.toBaseResponse(participation.user),
      projectRole: ProjectRoleMapper.toBaseResponse(participation.projectRole),
    };
  }
}
