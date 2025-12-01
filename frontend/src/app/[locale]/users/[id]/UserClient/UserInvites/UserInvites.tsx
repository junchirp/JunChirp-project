'use client';

import { ReactElement } from 'react';
import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';
import { UserInterface } from '@/shared/interfaces/user.interface';
import ParticipationsTable from '@/shared/components/ParticipationsTable/ParticipationsTable';
import DataContainer from '@/shared/components/DataContainer/DataContainer';
import { useTranslations } from 'next-intl';
import { useCancelInviteMutation } from '@/api/participationsApi';
import { useToast } from '@/hooks/useToast';

interface UserInvitesProps {
  invites: ProjectParticipationInterface[];
  user: UserInterface;
}

export default function UserInvites({
  invites,
  user,
}: UserInvitesProps): ReactElement {
  const tTable = useTranslations('participationsTable');
  const tAction = useTranslations('cancelInvite');
  const [cancelInvite, { isLoading }] = useCancelInviteMutation();
  const { showToast, isActive } = useToast();

  const handleCancel = async (
    invite: ProjectParticipationInterface,
  ): Promise<void> => {
    if (isActive('invite')) {
      return;
    }
    console.log(invite);

    const result = await cancelInvite({ id: invite.id, userId: user.id });
    if ('data' in result) {
      showToast({
        severity: 'success',
        summary: tAction('success'),
        life: 3000,
        actionKey: 'invite',
      });
    } else {
      showToast({
        severity: 'error',
        summary: tAction('error'),
        life: 3000,
        actionKey: 'invite',
      });
    }
  };

  return (
    <>
      <DataContainer title={tTable('userInvites')}>
        <ParticipationsTable
          items={invites}
          isLoading={isLoading}
          actionColumnWidth={175}
          cancel={handleCancel}
        />
      </DataContainer>
    </>
  );
}
