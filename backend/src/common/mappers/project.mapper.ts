import {
  Project,
  ProjectCategory,
  ProjectRole,
  ProjectRoleType,
  User,
  ProjectCategoryTranslation,
  ProjectLogo,
} from '@prisma/client';
import { ProjectResponseDto } from '../../projects/dto/project.response-dto';
import { ProjectRoleMapper } from './project-role.mapper';
import { ProjectCardResponseDto } from '../../projects/dto/project-card.response-dto';
import { ProjectCategoryMapper } from './project-category.mapper';
import { ProjectLogoMapper } from './project-logo.mapper';
import { UserMapper } from './user.mapper';
import { MyParticipationResponseDto } from '../../participations/dto/my-participation.response-dto';
import { ProjectCardExpandedResponseDto } from '../../projects/dto/project-card-expanded.response-dto';

export class ProjectMapper {
  public static toBaseCardResponse(
    project: Project & {
      logo: ProjectLogo | null;
      category: ProjectCategory & {
        translations: ProjectCategoryTranslation[];
      };
      roles: (ProjectRole & {
        roleType: ProjectRoleType;
        users: (User & { desiredRoles: ProjectRoleType[] })[];
      })[];
    },
  ): ProjectCardResponseDto {
    return {
      id: project.id,
      projectName: project.projectName,
      description: project.description,
      ownerId: project.ownerId,
      participantsCount: project.participantsCount,
      status: project.status,
      createdAt: project.createdAt,
      duration: project.finishedAt
        ? ProjectMapper.calculateDurationMonths(
          project.createdAt,
          project.finishedAt,
        )
        : null,
      category: ProjectCategoryMapper.toResponse(project.category),
      logo: project.logo ? ProjectLogoMapper.toResponse(project.logo) : null,
      publicUrl: project.publicUrl,
      roles: project.roles.map((role) =>
        ProjectRoleMapper.toUserResponse(role),
      ),
    };
  }

  public static toExpandedCardResponse(
    project: Project & {
      logo: ProjectLogo | null;
      category: ProjectCategory & {
        translations: ProjectCategoryTranslation[];
      };
      roles: (ProjectRole & {
        roleType: ProjectRoleType;
        users: (User & { desiredRoles: ProjectRoleType[] })[];
      })[];
    },
    myParticipation: MyParticipationResponseDto | null,
  ): ProjectCardExpandedResponseDto {
    return {
      id: project.id,
      projectName: project.projectName,
      description: project.description,
      ownerId: project.ownerId,
      participantsCount: project.participantsCount,
      status: project.status,
      createdAt: project.createdAt,
      duration: project.finishedAt
        ? ProjectMapper.calculateDurationMonths(
          project.createdAt,
          project.finishedAt,
        )
        : null,
      category: ProjectCategoryMapper.toResponse(project.category),
      logo: project.logo ? ProjectLogoMapper.toResponse(project.logo) : null,
      publicUrl: project.publicUrl,
      roles: project.roles.map((role) =>
        ProjectRoleMapper.toUserResponse(role),
      ),
      myParticipation,
    };
  }

  public static toFullResponse(
    project: Project & {
      logo: ProjectLogo | null;
      category: ProjectCategory & {
        translations: ProjectCategoryTranslation[];
      };
      roles: (ProjectRole & {
        roleType: ProjectRoleType;
        users: (User & { desiredRoles: ProjectRoleType[] })[];
      })[];
      owner: User & { desiredRoles: ProjectRoleType[] };
    },
  ): ProjectResponseDto {
    return {
      id: project.id,
      projectName: project.projectName,
      description: project.description,
      ownerId: project.ownerId,
      owner: UserMapper.toBaseResponse(project.owner),
      participantsCount: project.participantsCount,
      status: project.status,
      createdAt: project.createdAt,
      duration: project.finishedAt
        ? ProjectMapper.calculateDurationMonths(
          project.createdAt,
          project.finishedAt,
        )
        : null,
      category: ProjectCategoryMapper.toResponse(project.category),
      discordUrl: project.discordUrl,
      logo: project.logo ? ProjectLogoMapper.toResponse(project.logo) : null,
      publicUrl: project.publicUrl,
      roles: project.roles.map((role) =>
        ProjectRoleMapper.toUserResponse(role),
      ),
    };
  }

  private static calculateDurationMonths(start: Date, end: Date): number {
    let months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    if (end.getDate() < start.getDate()) {
      months -= 1;
    }

    return Math.max(0, months);
  }
}
