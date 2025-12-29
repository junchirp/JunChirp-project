import {
  Board,
  Project,
  ProjectCategory,
  ProjectRole,
  Document,
  ProjectRoleType,
  User,
  ProjectCategoryTranslation,
} from '@prisma/client';
import { ProjectResponseDto } from '../../projects/dto/project.response-dto';
import { ProjectRoleMapper } from './project-role.mapper';
import { ProjectCardResponseDto } from '../../projects/dto/project-card.response-dto';
import { BoardMapper } from './board.mapper';
import { ProjectCategoryMapper } from './project-category.mapper';

export class ProjectMapper {
  public static toCardResponse(
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
      logoUrl: project.logoUrl,
      publicUrl: project.publicUrl,
      roles: project.roles.map((role) =>
        ProjectRoleMapper.toUserResponse(role),
      ),
    };
  }

  public static toFullResponse(
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
      documents: Document[];
      boards: Board[];
    },
  ): ProjectResponseDto {
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
      discordUrl: project.discordUrl,
      logoUrl: project.logoUrl,
      publicUrl: project.publicUrl,
      documents: project.documents,
      roles: project.roles.map((role) =>
        ProjectRoleMapper.toUserResponse(role),
      ),
      boards: project.boards.map((board) => BoardMapper.toBaseResponse(board)),
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
