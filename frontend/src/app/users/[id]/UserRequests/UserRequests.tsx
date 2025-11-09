'use client';

import { ReactElement, useState } from 'react';
import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';
import RejectRequestPopup from '@/shared/components/RejectRequestPopup/RejectRequestPopup';
import { UserInterface } from '@/shared/interfaces/user.interface';
import { useAcceptRequestMutation } from '@/api/participationsApi';
import ParticipationsTable from '@/shared/components/ParticipationsTable/ParticipationsTable';
import DataContainer from '@/shared/components/DataContainer/DataContainer';

interface UserRequestsProps {
  requests: ProjectParticipationInterface[];
  user: UserInterface;
}

export default function UserRequests({
  requests,
  user,
}: UserRequestsProps): ReactElement {
  const [request, setRequest] = useState<ProjectParticipationInterface | null>(
    null,
  );
  const [acceptRequest, { isLoading }] = useAcceptRequestMutation();

  const openModal = (req: ProjectParticipationInterface): void => {
    setRequest(req);
  };

  const closeModal = (): void => {
    setRequest(null);
  };

  const handleAcceptRequest = async (id: string): Promise<void> => {
    await acceptRequest({ id, userId: user.id });
  };

  return (
    <>
      <DataContainer title="Заявки на участь">
        <ParticipationsTable
          items={requests}
          openModal={openModal}
          isLoading={isLoading}
          actionColumnWidth={280}
          accept={handleAcceptRequest}
        />
      </DataContainer>
      {request && (
        <RejectRequestPopup
          onClose={closeModal}
          request={request}
          user={user}
        />
      )}
    </>
  );
}
