'use client';

import { ReactElement } from 'react';
import { ProjectCardInterface } from '@/shared/interfaces/project-card.interface';
import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import { ProjectRoleInterface } from '@/shared/interfaces/project-role.interface';
import ParticipationRequestForm from './ParticipationRequestForm/ParticipationRequestForm';
import InviteFooter from './InviteFooter/InviteFooter';
import RequestFooter from './RequestFooter/RequestFooter';
import MemberFooter from './MemberFooter/MemberFooter';
import GuestClosedFooter from './GuestClosedFooter/GuestClosedFooter';
import GuestEmptyFooter from './GuestEmptyFooter/GuestEmptyFooter';

type FooterResultType =
  | { variant: 'guest-invite'; invite: ProjectParticipationInterface }
  | { variant: 'guest-request'; request: ProjectParticipationInterface }
  | { variant: 'guest-active-roles' }
  | { variant: 'member' }
  | { variant: 'guest-closed' }
  | { variant: 'guest-active-empty' };

interface ProjectCardFooterProps {
  project: ProjectCardInterface;
  invites: ProjectParticipationInterface[];
  requests: ProjectParticipationInterface[];
  user: AuthInterface | null;
  size: 'small' | 'large';
  className?: string;
}

export default function ProjectCardFooter({
  project,
  invites,
  requests,
  user,
  size,
  className,
}: ProjectCardFooterProps): ReactElement {
  const currentInvite = invites.find(
    (invite) => invite.projectRole.project.id === project.id,
  );
  const currentRequest = requests.find(
    (req) => req.projectRole.project.id === project.id,
  );
  const vacantRoles: ProjectRoleInterface[] = project.roles
    .filter((role) => role.users.length < role.slots)
    .map((role) => ({
      id: role.id,
      roleType: role.roleType,
      slots: role.slots,
    }));
  const isMyProject = project.roles.some((role) =>
    role.users.some((u) => u.id === user?.id),
  );

  const assertNever = (): never => {
    throw new Error('Unexpected variant');
  };

  const getFooter = (): FooterResultType => {
    if (isMyProject) {
      return { variant: 'member' };
    }
    if (project.status === 'done') {
      return { variant: 'guest-closed' };
    }
    if (currentInvite) {
      return { variant: 'guest-invite', invite: currentInvite };
    }
    if (currentRequest) {
      return { variant: 'guest-request', request: currentRequest };
    }
    if (vacantRoles.length) {
      return { variant: 'guest-active-roles' };
    }
    return { variant: 'guest-active-empty' };
  };

  const footer = getFooter();

  switch (footer.variant) {
    case 'guest-invite':
      return (
        <InviteFooter
          currentInvite={footer.invite}
          vacantRoles={vacantRoles}
          user={user}
          className={className}
          size={size}
        />
      );
    case 'guest-request':
      return (
        <RequestFooter
          currentRequest={footer.request}
          vacantRoles={vacantRoles}
          user={user}
          className={className}
          size={size}
        />
      );
    case 'guest-active-roles':
      return (
        <ParticipationRequestForm
          project={project}
          vacantRoles={vacantRoles}
          user={user}
          className={className}
          size={size}
        />
      );
    case 'member':
      return (
        <MemberFooter
          project={project}
          user={user}
          vacantRoles={vacantRoles}
          className={className}
          size={size}
        />
      );
    case 'guest-closed':
      return <GuestClosedFooter publicUrl={project.publicUrl} size={size} />;
    case 'guest-active-empty':
      return <GuestEmptyFooter size={size} />;
    default:
      return assertNever();
  }
}
