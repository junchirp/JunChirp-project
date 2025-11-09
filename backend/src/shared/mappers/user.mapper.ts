import {
  Education,
  ProjectRoleType,
  Role,
  Social,
  User,
  UserHardSkill,
  UserSoftSkill,
} from '@prisma/client';
import { UserResponseDto } from '../../users/dto/user.response-dto';
import { EducationMapper } from './education.mapper';
import { SocialMapper } from './social.mapper';
import { SoftSkillMapper } from './soft-skill.mapper';
import { HardSkillMapper } from './hard-skill.mapper';
import { UserWithPasswordResponseDto } from '../../users/dto/user-with-password.response-dto';
import { UserCardResponseDto } from '../../users/dto/user-card.response-dto';
import { AuthResponseDto } from '../../users/dto/auth.response-dto';

export class UserMapper {
  public static toFullResponse(
    user: User & {
      role: Role;
      educations: Education[];
      socials: Social[];
      softSkills: UserSoftSkill[];
      hardSkills: UserHardSkill[];
      desiredRoles: ProjectRoleType[];
    },
    withPassword: boolean,
  ): UserResponseDto | UserWithPasswordResponseDto {
    const base = {
      id: user.id,
      googleId: user.googleId,
      discordId: user.discordId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      isVerified: user.isVerified,
      role: user.role,
      activeProjectsCount: user.activeProjectsCount,
      doneProjectsCount: user.doneProjectsCount,
      educations: user.educations.map((education) =>
        EducationMapper.toResponse(education),
      ),
      socials: user.socials.map((social) => SocialMapper.toResponse(social)),
      softSkills: user.softSkills.map((skill) =>
        SoftSkillMapper.toResponse(skill),
      ),
      hardSkills: user.hardSkills.map((skill) =>
        HardSkillMapper.toResponse(skill),
      ),
      desiredRoles: user.desiredRoles,
    };

    return withPassword
      ? {
          ...base,
          password: user.password,
        }
      : base;
  }

  public static toCardResponse(
    user: User & {
      desiredRoles: ProjectRoleType[];
    },
  ): UserCardResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      desiredRoles: user.desiredRoles,
      activeProjectsCount: user.activeProjectsCount,
      doneProjectsCount: user.doneProjectsCount,
    };
  }

  public static toAuthResponse(
    user: User & {
      role: Role;
      desiredRoles: ProjectRoleType[];
    },
  ): AuthResponseDto {
    return {
      id: user.id,
      googleId: user.googleId,
      discordId: user.discordId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      isVerified: user.isVerified,
      role: user.role,
      activeProjectsCount: user.activeProjectsCount,
      doneProjectsCount: user.doneProjectsCount,
      desiredRoles: user.desiredRoles,
    };
  }
}
