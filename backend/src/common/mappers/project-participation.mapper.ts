import { ParticipationModelType } from '../types/participation-model.type';
import {
  Project,
  ProjectCategory,
  ProjectCategoryTranslation,
  ProjectLogo,
  ProjectRole,
  ProjectRoleType,
  User,
} from '@prisma/client';
import { ProjectRoleMapper } from './project-role.mapper';
import { ProjectParticipationResponseDto } from '../../participations/dto/project-participation.response-dto';

export class ProjectParticipationMapper {
  public static toResponse(
    participation: ParticipationModelType & {
      projectRole: ProjectRole & {
        roleType: ProjectRoleType;
        project: Project & {
          logo: ProjectLogo | null;
          category: ProjectCategory & {
            translations: ProjectCategoryTranslation[];
          };
          roles: (ProjectRole & {
            roleType: ProjectRoleType;
            users: (User & {
              desiredRoles: ProjectRoleType[];
            })[];
          })[];
        };
      };
    },
  ): ProjectParticipationResponseDto {
    return {
      id: participation.id,
      createdAt: participation.createdAt,
      acceptedAt: participation.acceptedAt,
      canceledAt: participation.canceledAt,
      rejectedAt: participation.rejectedAt,
      reservedAt: participation.reservedAt,
      status: participation.status,
      userId: participation.userId,
      projectRole: ProjectRoleMapper.toProjectResponse(
        participation.projectRole,
      ),
    };
  }
}
