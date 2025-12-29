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
  const tDiscord = useTranslations('discord');

  const openModal = (inv: ProjectParticipationInterface): void => {
    setInvite(inv);
  };

  const closeModal = (): void => {
    setInvite(null);
  };

  const closeBanner = (): void => setBanner(false);

  const handleAcceptInvite = async (id: string): Promise<void> => {
    if (!user.discordId) {
      setBanner(true);
      return;
    }

    await acceptInvite(id);
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
        <RejectInvitePopup onClose={closeModal} invite={invite} user={user} />
      )}
      {isBanner && (
        <DiscordBanner
          closeBanner={closeBanner}
          message={tDiscord('invite')}
          isCancelButton
          withWrapper
        />
      )}
    </>
  );
}
