'use client';

import { ReactElement, useState } from 'react';
import DataContainer from '@/shared/components/DataContainer/DataContainer';
import ParticipationsTable from '@/shared/components/ParticipationsTable/ParticipationsTable';
import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';
import CancelRequestPopup from './CancelRequestPopup/CancelRequestPopup';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import { useTranslations } from 'next-intl';
import Pagination from '@/shared/components/Pagination/Pagination';
import { useGetMyRequestsQuery } from '@/api/participationsApi';
import { useRequestsFilters } from '@/hooks/useRequestsFilters';
import { usePagination } from '@/hooks/usePagination';
import { limitOptions } from '@/shared/constants/limit-options';

interface MyRequestsProps {
  user: AuthInterface;
}

export default function MyRequests({
  user,
}: MyRequestsProps): ReactElement | null {
  const { filters, updateFilters } = useRequestsFilters();
  const { data: list } = useGetMyRequestsQuery({
    id: user.id,
    params: {
      page: filters.requestsPage,
      limit: filters.requestsLimit,
    },
  });
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
      <DataContainer title={t('myRequests')}>
        <ParticipationsTable
          items={list.requests}
          openModal={openModal}
          actionColumnWidth={175}
          page={filters.requestsPage}
          limit={filters.requestsLimit}
          isLoading={false}
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
        <CancelRequestPopup
          onClose={closeModal}
          requestId={request.id}
          projectName={request.projectRole.project.projectName}
          projectId={request.projectRole.project.id}
          isOpen={!!request}
        />
      )}
    </>
  );
}
