'use client';

import { ReactElement, useState } from 'react';
import DataContainer from '@/shared/components/DataContainer/DataContainer';
import ParticipationsTable from '@/shared/components/ParticipationsTable/ParticipationsTable';
import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';
import CancelRequestPopup from '@/shared/components/CancelRequestPopup/CancelRequestPopup';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import { useTranslations } from 'next-intl';

interface MyRequestsProps {
  requests: ProjectParticipationInterface[];
  user: AuthInterface;
}

export default function MyRequests({
  requests,
  user,
}: MyRequestsProps): ReactElement {
  const [request, setRequest] = useState<ProjectParticipationInterface | null>(
    null,
  );
  const t = useTranslations('participationsTable');

  const openModal = (req: ProjectParticipationInterface): void => {
    setRequest(req);
  };

  const closeModal = (): void => {
    setRequest(null);
  };

  return (
    <>
      <DataContainer title={t('myRequests')}>
        <ParticipationsTable
          items={requests}
          openModal={openModal}
          actionColumnWidth={175}
          isLoading={false}
        />
      </DataContainer>
      {request && (
        <CancelRequestPopup
          onClose={closeModal}
          request={request}
          user={user}
        />
      )}
    </>
  );
}
