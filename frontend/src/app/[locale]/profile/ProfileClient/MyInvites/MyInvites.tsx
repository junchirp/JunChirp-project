'use client';

import { ReactElement, useState } from 'react';
import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';
import { useAcceptInviteMutation } from '@/api/participationsApi';
import ParticipationsTable from '@/shared/components/ParticipationsTable/ParticipationsTable';
import DataContainer from '@/shared/components/DataContainer/DataContainer';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import RejectInvitePopup from '@/shared/components/RejectInvitePopup/RejectInvitePopup';
import { useTranslations } from 'next-intl';
import DiscordBanner from '@/shared/components/DiscordBanner/DiscordBanner';
import { useToast } from '@/hooks/useToast';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';

interface MyInvitesProps {
  invites: ProjectParticipationInterface[];
  user: AuthInterface;
}

export default function MyInvites({
  invites,
  user,
}: MyInvitesProps): ReactElement {
  const [invite, setInvite] = useState<ProjectParticipationInterface | null>(
    null,
  );
  const [isBanner, setBanner] = useState(false);
  const [acceptInvite, { isLoading }] = useAcceptInviteMutation();
  const tTable = useTranslations('participationsTable');
  const tInvite = useTranslations('acceptInvite');
  const { showToast, isActive } = useToast();

  const openModal = (inv: ProjectParticipationInterface): void => {
    setInvite(inv);
  };

  const closeModal = (): void => {
    setInvite(null);
  };

  const closeBanner = (): void => setBanner(false);

  const handleAcceptInvite = async (
    inv: ProjectParticipationInterface,
  ): Promise<void> => {
    if (isActive(ToastKeysEnum.PARTICIPATION_INVITE)) {
      return;
    }

    if (!user.discordId) {
      setBanner(true);
      return;
    }

    try {
      await acceptInvite(inv.id).unwrap();

      showToast({
        severity: 'success',
        summary: tInvite('success'),
        life: 3000,
        actionKey: ToastKeysEnum.PARTICIPATION_INVITE,
      });
    } catch {
      showToast({
        severity: 'error',
        summary: tInvite('error'),
        detail: tInvite('errorDetails'),
        life: 3000,
        actionKey: ToastKeysEnum.PARTICIPATION_INVITE,
      });
    }
  };

  return (
    <>
      <DataContainer title={tTable('myInvites')}>
        <ParticipationsTable
          items={invites}
          openModal={openModal}
          isLoading={isLoading}
          actionColumnWidth={280}
          accept={handleAcceptInvite}
        />
      </DataContainer>
      {invite && (
        <RejectInvitePopup
          onClose={closeModal}
          invite={invite}
          user={user}
          isOpen={!!invite}
        />
      )}
      {isBanner && (
        <DiscordBanner closeBanner={closeBanner} isCancelButton withWrapper />
      )}
    </>
  );
}
