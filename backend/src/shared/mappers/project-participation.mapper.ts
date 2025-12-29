import { Participation } from '../types/participation.type';
import {
  Project,
  ProjectCategory,
  ProjectCategoryTranslation,
  ProjectRole,
  ProjectRoleType,
  User,
} from '@prisma/client';
import { ProjectRoleMapper } from './project-role.mapper';
import { ProjectParticipationResponseDto } from '../../participations/dto/project-participation.response-dto';

export class ProjectParticipationMapper {
  public static toResponse(
    participation: Participation & {
      projectRole: ProjectRole & {
        roleType: ProjectRoleType;
        project: Project & {
          category: ProjectCategory & {
            translations: ProjectCategoryTranslation[];
          };
          roles: (ProjectRole & {
            roleType: ProjectRoleType;
            user:
              | (User & {
                  desiredRoles: ProjectRoleType[];
                })
              | null;
          })[];
        };
      };
    },
  ): ProjectParticipationResponseDto {
    return {
      id: participation.id,
      createdAt: participation.createdAt,
      userId: participation.userId,
      projectRole: ProjectRoleMapper.toProjectResponse(
        participation.projectRole,
      ),
    };
  }
}
