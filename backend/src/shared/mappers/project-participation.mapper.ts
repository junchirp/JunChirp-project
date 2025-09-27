import { Participation } from '../types/participation.type';
import {
  Education,
  Project,
  ProjectCategory,
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
          category: ProjectCategory;
          roles: (ProjectRole & {
            roleType: ProjectRoleType;
            user:
              | (User & {
                  educations: (Education & {
                    specialization: ProjectRoleType;
                  })[];
                })
              | null;
          })[];
        };
      };
    },
  ): ProjectParticipationResponseDto {
    return {
      id: participation.id,
      userId: participation.userId,
      projectRole: ProjectRoleMapper.toProjectResponse(
        participation.projectRole,
      ),
    };
  }
}
