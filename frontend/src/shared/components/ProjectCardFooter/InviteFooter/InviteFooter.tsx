'use client';

import { ReactElement, useState } from 'react';
import styles from './InviteFooter.module.scss';
import VacantRoles from '@/shared/components/VacantRoles/VacantRoles';
import ProjectCardActionsWrapper from '@/shared/components/ProjectCardActionsWrapper/ProjectCardActionsWrapper';
import Button from '@/shared/components/Button/Button';
import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';
import { ProjectRoleInterface } from '@/shared/interfaces/project-role.interface';
import RejectInvitePopup from '@/shared/components/RejectInvitePopup/RejectInvitePopup';
import DiscordBanner from '@/shared/components/DiscordBanner/DiscordBanner';
import { useTranslations } from 'next-intl';
import { useAcceptInviteMutation } from '@/api/participationsApi';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import { useToast } from '@/hooks/useToast';
import { useRouter } from '@/i18n/routing';

interface InviteFooterProps {
  currentInvite: ProjectParticipationInterface;
  vacantRoles: ProjectRoleInterface[];
  size: 'small' | 'large';
  user: AuthInterface | null;
  className?: string;
}

export default function InviteFooter({
  currentInvite,
  vacantRoles,
  size,
  user,
  className,
}: InviteFooterProps): ReactElement {
  const tButtons = useTranslations('buttons');
  const tProjectsPage = useTranslations('projectsPage');
  const tDiscord = useTranslations('discord');
  const [isInvitePopupOpen, setInvitePopupOpen] = useState(false);
  const [isInviteBanner, setInviteBanner] = useState(false);
  const [acceptInvite, { isLoading: inviteLoading }] =
    useAcceptInviteMutation();
  const { showToast, isActive } = useToast();
  const project = currentInvite.projectRole.project;
  const isMyProject = project.roles
    .map((role) => role.user)
    .some((member) => member && member.id === user?.id);
  const router = useRouter();

  const closeInvitePopup = (): void => setInvitePopupOpen(false);
  const openInvitePopup = (): void => setInvitePopupOpen(true);
  const closeInviteBanner = (): void => setInviteBanner(false);

  const goProject = (): void => {
    if (isMyProject) {
      router.push(`/projects/${project.id}/cab`);
    } else {
      router.push(`/projects/${project.id}`);
    }
  };

  const handleAccept = async (): Promise<void> => {
    if (!user?.discordId) {
      setInviteBanner(true);
      return;
    }

    if (isActive(ToastKeysEnum.PARTICIPATION_INVITE)) {
      return;
    }

    if (currentInvite) {
      const result = await acceptInvite(currentInvite.id);

      if ('error' in result) {
        const errorData = result.error as
          | ((FetchBaseQueryError | SerializedError) & {
              status: number;
            })
          | undefined;
        const status = errorData?.status;

        if (status === 400) {
          showToast({
            severity: 'error',
            summary: tProjectsPage('invite.error400'),
            life: 3000,
            actionKey: ToastKeysEnum.PARTICIPATION_INVITE,
          });
        } else {
          showToast({
            severity: 'error',
            summary: tProjectsPage('invite.error'),
            detail: tProjectsPage('invite.errorDetails'),
            life: 3000,
            actionKey: ToastKeysEnum.PARTICIPATION_INVITE,
          });
        }
      }

      if ('data' in result) {
        goProject();
      }
    }
  };

  return (
    <>
      <div className={styles['invite-footer']}>
        <VacantRoles
          vacantRoles={vacantRoles}
          currentInvite={currentInvite}
          size={size}
          className={className}
        />
        <ProjectCardActionsWrapper size={size}>
          <Button
            color="red"
            variant="secondary-frame"
            onClick={openInvitePopup}
          >
            {tButtons('decline')}
          </Button>
          <Button color="green" onClick={handleAccept} loading={inviteLoading}>
            {tButtons('accept')}
          </Button>
        </ProjectCardActionsWrapper>
      </div>
      {isInvitePopupOpen && currentInvite && user && (
        <RejectInvitePopup
          onClose={closeInvitePopup}
          invite={currentInvite}
          user={user}
        />
      )}
      {isInviteBanner && (
        <DiscordBanner
          closeBanner={closeInviteBanner}
          message={tDiscord('invite')}
          isCancelButton
          withWrapper
        />
      )}
    </>
  );
}
