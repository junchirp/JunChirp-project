'use client';

import { ReactElement, useState } from 'react';
import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';
import RejectRequestPopup from '@/shared/components/RejectRequestPopup/RejectRequestPopup';
import { UserInterface } from '@/shared/interfaces/user.interface';
import {
  useAcceptRequestMutation,
  useGetUserRequestsInMyProjectsQuery,
  useRejectRequestMutation,
} from '@/api/participationsApi';
import ParticipationsTable from '@/shared/components/ParticipationsTable/ParticipationsTable';
import DataContainer from '@/shared/components/DataContainer/DataContainer';
import { useTranslations } from 'next-intl';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { useToast } from '@/hooks/useToast';
import { useRequestsFilters } from '@/hooks/useRequestsFilters';
import Pagination from '@/shared/components/Pagination/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { limitOptions } from '@/shared/constants/limit-options';

interface UserRequestsProps {
  user: UserInterface;
}

export default function UserRequests({
  user,
}: UserRequestsProps): ReactElement | null {
  const { filters, updateFilters } = useRequestsFilters();
  const { data: list } = useGetUserRequestsInMyProjectsQuery({
    id: user.id,
    params: {
      page: filters.requestsPage,
      limit: filters.requestsLimit,
    },
  });
  const [request, setRequest] = useState<ProjectParticipationInterface | null>(
    null,
  );
  const [acceptRequest, { isLoading: acceptRequestLoading }] =
    useAcceptRequestMutation();
  const t = useTranslations('participationsTable');
  const tPopup = useTranslations('declineRequestPopup');
  const tRequest = useTranslations('acceptRequest');
  const [declineRequest, { isLoading: declineRequestLoading }] =
    useRejectRequestMutation();
  const { showToast, isActive } = useToast();

  const openModal = (req: ProjectParticipationInterface): void => {
    setRequest(req);
  };

  const closeModal = (): void => {
    setRequest(null);
  };

  const handleAcceptRequest = async (
    req: ProjectParticipationInterface,
  ): Promise<void> => {
    if (isActive(ToastKeysEnum.PARTICIPATION_REQUEST)) {
      return;
    }

    try {
      await acceptRequest({
        id: req.id,
        userId: req.userId,
        projectId: req.projectRole.project.id,
      }).unwrap();

      showToast({
        severity: 'success',
        summary: tRequest('success'),
        life: 3000,
        actionKey: ToastKeysEnum.PARTICIPATION_REQUEST,
      });
    } catch {
      showToast({
        severity: 'error',
        summary: tRequest('error'),
        detail: tRequest('errorDetails'),
        life: 3000,
        actionKey: ToastKeysEnum.PARTICIPATION_REQUEST,
      });
    }
  };

  const handleDeclineRequest = async (
    id: string,
    userId: string,
    projectId: string,
  ): Promise<void> => {
    if (isActive(ToastKeysEnum.PARTICIPATION_REQUEST)) {
      return;
    }

    try {
      await declineRequest({ id, userId, projectId }).unwrap();

      showToast({
        severity: 'success',
        summary: tPopup('success'),
        life: 3000,
        actionKey: ToastKeysEnum.PARTICIPATION_REQUEST,
      });
    } catch {
      showToast({
        severity: 'error',
        summary: tPopup('error'),
        detail: tPopup('errorDetails'),
        life: 3000,
        actionKey: ToastKeysEnum.PARTICIPATION_REQUEST,
      });
    } finally {
      closeModal();
    }
  };

  const { onLimitChange, onPageChange } = usePagination({
    defaultLimit: 10,
    allowedLimits: limitOptions,
    filters,
    limitKey: 'requestsLimit',
    pageKey: 'requestsPage',
    total: list?.total ?? 0,
    updateFilters,
  });

  if (!list || list?.total === 0) {
    return null;
  }

  return (
    <>
      <DataContainer title={t('userRequests')}>
        <ParticipationsTable
          items={list.requests}
          openModal={openModal}
          isLoading={acceptRequestLoading}
          actionColumnWidth={280}
          accept={handleAcceptRequest}
          limit={filters.requestsLimit}
          page={filters.requestsPage}
        />
        {list.total > filters.requestsLimit && (
          <Pagination
            total={list.total}
            limit={filters.requestsLimit}
            page={filters.requestsPage}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
          />
        )}
      </DataContainer>
      {request && (
        <RejectRequestPopup
          onClose={closeModal}
          isOpen={!!request}
          loading={declineRequestLoading}
          onConfirm={handleDeclineRequest}
          data={{
            id: request.id,
            userId: request.userId,
            userName: `${user.firstName} ${user.lastName}`,
            projectId: request.projectRole.project.id,
            projectName: request.projectRole.project.projectName,
            roleId: request.projectRole.id,
          }}
        />
      )}
    </>
  );
}
