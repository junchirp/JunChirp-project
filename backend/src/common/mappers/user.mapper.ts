import {
  type Education,
  type ProjectRoleType,
  type Role,
  type Social,
  type User,
  type UserHardSkill,
  type UserSoftSkill,
} from '@prisma/client';
import { type UserResponseDto } from '../../users/dto/user.response-dto';
import { EducationMapper } from './education.mapper';
import { SocialMapper } from './social.mapper';
import { SoftSkillMapper } from './soft-skill.mapper';
import { HardSkillMapper } from './hard-skill.mapper';
import { type AuthWithPasswordResponseDto } from '../../users/dto/auth-with-password.response-dto';
import { type UserCardResponseDto } from '../../users/dto/user-card.response-dto';
import { type AuthResponseDto } from '../../users/dto/auth.response-dto';
import { type UserParticipationInMyProjectsResponseDto } from '../../users/dto/user-participation-in-my-projects.response-dto';
import { type UserBaseResponseDto } from '../../users/dto/user-base.response-dto';

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
    projectParticipationSummary: UserParticipationInMyProjectsResponseDto,
  ): UserResponseDto {
    return {
      id: user.id,
      googleId: user.googleId,
      discordId: user.discordId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      isVerified: user.isVerified,
      isBlocked: user.isBlocked,
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
      projectParticipationSummary,
    };
  }

  public static toCardResponse(
    user: User & {
      desiredRoles: ProjectRoleType[];
    },
    projectParticipationSummary: UserParticipationInMyProjectsResponseDto,
  ): UserCardResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      desiredRoles: user.desiredRoles,
      activeProjectsCount: user.activeProjectsCount,
      doneProjectsCount: user.doneProjectsCount,
      projectParticipationSummary,
    };
  }

  public static toAuthResponse(
    user: User & {
      role: Role;
      desiredRoles: ProjectRoleType[];
    },
    withPassword: boolean,
  ): AuthResponseDto | AuthWithPasswordResponseDto {
    const base = {
      id: user.id,
      googleId: user.googleId,
      discordId: user.discordId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      isVerified: user.isVerified,
      isBlocked: user.isBlocked,
      role: user.role,
      activeProjectsCount: user.activeProjectsCount,
      doneProjectsCount: user.doneProjectsCount,
      desiredRoles: user.desiredRoles,
    };

    return withPassword
      ? {
          ...base,
          password: user.password,
        }
      : base;
  }

  public static toBaseResponse(
    user: User & {
      desiredRoles: ProjectRoleType[];
    },
  ): UserBaseResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      activeProjectsCount: user.activeProjectsCount,
      doneProjectsCount: user.doneProjectsCount,
      desiredRoles: user.desiredRoles,
    };
  }
}
