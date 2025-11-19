'use client';

import { ReactElement, useState } from 'react';
import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';
import { useAcceptInviteMutation } from '@/api/participationsApi';
import ParticipationsTable from '@/shared/components/ParticipationsTable/ParticipationsTable';
import DataContainer from '@/shared/components/DataContainer/DataContainer';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import RejectInvitePopup from '@/shared/components/RejectInvitePopup/RejectInvitePopup';
import { useTranslations } from 'next-intl';

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
  const [acceptInvite, { isLoading }] = useAcceptInviteMutation();
  const t = useTranslations('participationsTable');

  const openModal = (inv: ProjectParticipationInterface): void => {
    setInvite(inv);
  };

  const closeModal = (): void => {
    setInvite(null);
  };

  const handleAcceptInvite = async (id: string): Promise<void> => {
    await acceptInvite(id);
  };

  return (
    <>
      <DataContainer title={t('myInvites')}>
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
    </>
  );
}
