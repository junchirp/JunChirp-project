'use client';

import { ReactElement } from 'react';
import { ProjectCardExpandedInterface } from '@/shared/interfaces/project-card-expanded.interface';
import { MyParticipationInterface } from '@/shared/interfaces/my-participation.interface';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import { ProjectRoleInterface } from '@/shared/interfaces/project-role.interface';
import ParticipationRequestForm from './ParticipationRequestForm/ParticipationRequestForm';
import InviteFooter from './InviteFooter/InviteFooter';
import RequestFooter from './RequestFooter/RequestFooter';
import MemberFooter from './MemberFooter/MemberFooter';
import GuestClosedFooter from './GuestClosedFooter/GuestClosedFooter';
import GuestEmptyFooter from './GuestEmptyFooter/GuestEmptyFooter';
import { useLazyCheckDiscordQuery } from '@/api/discordApi';
import { useDiscord } from '@/hooks/useDiscord';
import { isDiscordNotConnectedError } from '@/shared/utils/isDiscordNotConnectedError';
import { isDiscordNotInGuildError } from '@/shared/utils/isDiscordNotInGuildError';

type FooterResultType =
  | { variant: 'guest-invite'; invite: MyParticipationInterface }
  | { variant: 'guest-request'; request: MyParticipationInterface }
  | { variant: 'guest-active-roles' }
  | { variant: 'member' }
  | { variant: 'guest-closed' }
  | { variant: 'guest-active-empty' };

interface ProjectCardFooterProps {
  project: ProjectCardExpandedInterface;
  user: AuthInterface;
  size: 'small' | 'large';
  className?: string;
}

export default function ProjectCardFooter({
  project,
  user,
  size,
  className,
}: ProjectCardFooterProps): ReactElement {
  const currentInvite =
    project.myParticipation?.type === 'invite' ? project.myParticipation : null;
  const currentRequest =
    project.myParticipation?.type === 'request'
      ? project.myParticipation
      : null;
  const vacantRoles: ProjectRoleInterface[] = project.roles
    .filter((role) => role.users.length < role.slots)
    .map((role) => ({
      id: role.id,
      roleType: role.roleType,
      slots: role.slots,
    }));
  const isMyProject =
    project.roles.some((role) => role.users.some((u) => u.id === user.id)) ||
    project.ownerId === user.id;
  const [checkDiscordQuery] = useLazyCheckDiscordQuery();
  const openDiscordConnect = useDiscord();

  const checkDiscord = async (): Promise<boolean> => {
    try {
      await checkDiscordQuery().unwrap();
      return true;
    } catch (error) {
      if (isDiscordNotConnectedError(error)) {
        openDiscordConnect({
          withWrapper: true,
          isCancelButton: true,
          errorCode: 'DISCORD_NOT_CONNECTED',
        });
      }

      if (isDiscordNotInGuildError(error)) {
        openDiscordConnect({
          withWrapper: true,
          isCancelButton: true,
          errorCode: 'DISCORD_NOT_IN_GUILD',
        });
      }

      return false;
    }
  };

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
          className={className}
          size={size}
          project={project}
        />
      );
    case 'guest-request':
      return (
        <RequestFooter
          currentRequest={footer.request}
          vacantRoles={vacantRoles}
          className={className}
          size={size}
          projectId={project.id}
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
          vacantRoles={vacantRoles}
          className={className}
          size={size}
          checkDiscord={checkDiscord}
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
