import { UserParticipationInterface } from '@/shared/interfaces/user-participation.interface';
import {
  TeamAllFlatSectionInterface,
  TeamInviteInterface,
  TeamMemberInterface,
  TeamRequestInterface,
  TeamRoleAllGroupInterface,
  TeamRoleGroupInterface,
  TeamVacancyInterface,
  TeamViewInterface,
} from '@/shared/interfaces/team-view-interface';
import { ProjectInterface } from '@/shared/interfaces/project.interface';
import { RoleWithUserInterface } from '@/shared/interfaces/role-with-user.interface';

function groupByRole<T>(
  roles: RoleWithUserInterface[],
  items: T[],
  getRoleId: (item: T) => string,
): TeamRoleGroupInterface<T>[] {
  const itemsByRole = new Map<string, T[]>();

  for (const item of items) {
    const roleId = getRoleId(item);
    const roleItems = itemsByRole.get(roleId);

    if (roleItems) {
      roleItems.push(item);
    } else {
      itemsByRole.set(roleId, [item]);
    }
  }

  return roles
    .map((role) => ({
      roleId: role.id,
      roleName: role.roleType.roleName,
      items: itemsByRole.get(role.id) ?? [],
    }))
    .filter((group) => group.items.length > 0);
}

function groupAllByRole(
  roles: RoleWithUserInterface[],
  members: TeamMemberInterface[],
  requests: TeamRequestInterface[],
  invitations: TeamInviteInterface[],
  vacancies: TeamVacancyInterface[],
  isOwner: boolean,
): TeamRoleAllGroupInterface[] {
  const groups = new Map<string, TeamRoleAllGroupInterface>();

  for (const role of roles) {
    groups.set(role.id, {
      roleId: role.id,
      roleName: role.roleType.roleName,
      items: {
        members: [],
        requests: [],
        invitations: [],
        vacancies: [],
      },
    });
  }

  for (const item of members) {
    groups.get(item.roleId)?.items.members.push(item);
  }

  if (isOwner) {
    for (const item of requests) {
      groups.get(item.request.projectRole.id)?.items.requests.push(item);
    }

    for (const item of invitations) {
      groups.get(item.invite.projectRole.id)?.items.invitations.push(item);
    }
  }

  for (const item of vacancies) {
    groups.get(item.roleId)?.items.vacancies.push(item);
  }

  return Array.from(groups.values());
}

export function buildTeamViewModel(params: {
  project: ProjectInterface | undefined;
  requests: UserParticipationInterface[];
  invites: UserParticipationInterface[];
  isOwner: boolean;
}): TeamViewInterface {
  const { project, requests, invites, isOwner } = params;

  if (!project) {
    return {
      flat: {
        all: {
          members: [],
          requests: [],
          invitations: [],
          vacancies: [],
        },
        members: [],
        requests: [],
        invitations: [],
        vacancies: [],
      },
      grouped: {
        all: [],
        members: [],
        requests: [],
        invitations: [],
        vacancies: [],
      },
    };
  }

  const members: TeamMemberInterface[] = project.roles.flatMap((role) =>
    role.users.map((user) => ({
      type: 'member',
      roleId: role.id,
      roleName: role.roleType.roleName,
      user,
    })),
  );

  const requestItems: TeamRequestInterface[] = requests.map((request) => ({
    type: 'request',
    request,
  }));

  const inviteItems: TeamInviteInterface[] = invites.map((invite) => ({
    type: 'invite',
    invite,
  }));

  const vacancyItems: TeamVacancyInterface[] = project.roles.flatMap((role) => {
    const vacancies = role.slots - role.users.length;

    return Array.from({ length: vacancies }, () => ({
      type: 'vacancy',
      roleId: role.id,
      roleName: role.roleType.roleName,
    }));
  });

  const allItems: TeamAllFlatSectionInterface = {
    members: members,
    vacancies: vacancyItems,
    requests: isOwner ? requestItems : [],
    invitations: isOwner ? inviteItems : [],
  };

  return {
    flat: {
      all: allItems,
      members,
      requests: isOwner ? requestItems : [],
      invitations: isOwner ? inviteItems : [],
      vacancies: vacancyItems,
    },

    grouped: {
      all: groupAllByRole(
        project.roles,
        members,
        requestItems,
        inviteItems,
        vacancyItems,
        isOwner,
      ),
      members: groupByRole(project.roles, members, (item) => item.roleId),
      requests: isOwner
        ? groupByRole(
            project.roles,
            requestItems,
            (item) => item.request.projectRole.id,
          )
        : [],
      invitations: isOwner
        ? groupByRole(
            project.roles,
            inviteItems,
            (item) => item.invite.projectRole.id,
          )
        : [],
      vacancies: groupByRole(
        project.roles,
        vacancyItems,
        (item) => item.roleId,
      ),
    },
  };
}
