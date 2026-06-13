import { UserCardInterface } from '@/shared/interfaces/user-card.interface';
import { UserParticipationInterface } from '@/shared/interfaces/user-participation.interface';
import { TeamCtxInterface } from '@/shared/constants/team';

export interface TeamMemberInterface {
  type: 'member';
  user: UserCardInterface;
  roleId: string;
  roleName: string;
}

export interface TeamRequestInterface {
  type: 'request';
  request: UserParticipationInterface;
}

export interface TeamInviteInterface {
  type: 'invite';
  invite: UserParticipationInterface;
}

export interface TeamVacancyInterface {
  type: 'vacancy';
  roleId: string;
  roleName: string;
}

export interface TeamAllFlatSectionInterface {
  members: TeamMemberInterface[];
  requests: TeamRequestInterface[];
  invitations: TeamInviteInterface[];
  vacancies: TeamVacancyInterface[];
}

export interface TeamRoleGroupInterface<T> {
  roleId: string;
  roleName: string;
  items: T[];
}

export interface TeamRoleAllGroupInterface {
  roleId: string;
  roleName: string;
  items: TeamAllFlatSectionInterface;
}

export interface TeamViewInterface {
  grouped: {
    all: TeamRoleAllGroupInterface[];
    members: TeamRoleGroupInterface<TeamMemberInterface>[];
    requests: TeamRoleGroupInterface<TeamRequestInterface>[];
    invitations: TeamRoleGroupInterface<TeamInviteInterface>[];
    vacancies: TeamRoleGroupInterface<TeamVacancyInterface>[];
  };
  ctx: TeamCtxInterface;
}
