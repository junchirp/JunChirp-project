'use client';

import { ReactElement, useState } from 'react';
import DataContainer from '../../../shared/components/DataContainer/DataContainer';
import ParticipationsTable from '../../../shared/components/ParticipationsTable/ParticipationsTable';
import { ProjectParticipationInterface } from '../../../shared/interfaces/project-participation.interface';
import CancelRequestPopup from '../../../shared/components/CancelRequestPopup/CancelRequestPopup';
import { AuthInterface } from '../../../shared/interfaces/auth.interface';

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

  const openModal = (req: ProjectParticipationInterface): void => {
    setRequest(req);
  };

  const closeModal = (): void => {
    setRequest(null);
  };

  return (
    <>
      <DataContainer title="Мої заявки">
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
