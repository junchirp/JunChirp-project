import {
  Project,
  ProjectCategory,
  ProjectCategoryTranslation,
  ProjectLogo,
  ProjectRole,
  ProjectRoleType,
  User,
} from '@prisma/client';
import { ProjectRoleResponseDto } from '../../project-roles/dto/project-role.response-dto';
import { ProjectRoleWithProjectResponseDto } from '../../project-roles/dto/project-role-with-project.response-dto';
import { ProjectMapper } from './project.mapper';
import { UserMapper } from './user.mapper';
import { ProjectRoleWithUserResponseDto } from '../../project-roles/dto/project-role-with-user.response-dto';

export class ProjectRoleMapper {
  public static toBaseResponse(
    role: ProjectRole & { roleType: ProjectRoleType },
  ): ProjectRoleResponseDto {
    return {
      id: role.id,
      roleType: role.roleType,
      slots: role.slots,
    };
  }

  public static toProjectResponse(
    role: ProjectRole & {
      roleType: ProjectRoleType;
      project: Project & {
        logo: ProjectLogo | null;
        category: ProjectCategory & {
          translations: ProjectCategoryTranslation[];
        };
        roles: (ProjectRole & {
          roleType: ProjectRoleType;
          users: (User & { desiredRoles: ProjectRoleType[] })[];
        })[];
      };
    },
  ): ProjectRoleWithProjectResponseDto {
    return {
      id: role.id,
      roleType: role.roleType,
      slots: role.slots,
      project: ProjectMapper.toCardResponse(role.project),
    };
  }

  public static toUserResponse(
    role: ProjectRole & {
      roleType: ProjectRoleType;
      users: (User & { desiredRoles: ProjectRoleType[] })[];
    },
  ): ProjectRoleWithUserResponseDto {
    return {
      id: role.id,
      roleType: role.roleType,
      slots: role.slots,
      users: role.users.map((user) => UserMapper.toCardResponse(user)),
    };
  }
}
