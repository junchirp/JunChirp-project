'use client';

import { ReactElement, useEffect } from 'react';
import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';
import { UserInterface } from '@/shared/interfaces/user.interface';
import ParticipationsTable from '@/shared/components/ParticipationsTable/ParticipationsTable';
import DataContainer from '@/shared/components/DataContainer/DataContainer';
import { useTranslations } from 'next-intl';
import {
  useCancelInviteMutation,
  useGetUserInvitesInMyProjectsQuery,
} from '@/api/participationsApi';
import { useToast } from '@/hooks/useToast';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { useInvitesFilters } from '@/hooks/useInvitesFilters';
import Pagination from '@/shared/components/Pagination/Pagination';

interface UserInvitesProps {
  user: UserInterface;
}

export default function UserInvites({
  user,
}: UserInvitesProps): ReactElement | null {
  const tTable = useTranslations('participationsTable');
  const tAction = useTranslations('cancelInvite');
  const [cancelInvite, { isLoading }] = useCancelInviteMutation();
  const { showToast, isActive } = useToast();
  const { filters, updateFilters } = useInvitesFilters();
  const { data: list } = useGetUserInvitesInMyProjectsQuery({
    id: user.id,
    params: {
      page: filters.invitesPage,
      limit: filters.invitesLimit,
    },
  });

  const handleCancel = async (
    invite: ProjectParticipationInterface,
  ): Promise<void> => {
    if (isActive(ToastKeysEnum.PARTICIPATION_INVITE)) {
      return;
    }

    try {
      await cancelInvite({
        id: invite.id,
        userId: user.id,
        projectId: invite.projectRole.project.id,
      }).unwrap();

      showToast({
        severity: 'success',
        summary: tAction('success'),
        life: 3000,
        actionKey: ToastKeysEnum.PARTICIPATION_INVITE,
      });
    } catch {
      showToast({
        severity: 'error',
        summary: tAction('error'),
        detail: tAction('errorDetails'),
        life: 3000,
        actionKey: ToastKeysEnum.PARTICIPATION_INVITE,
      });
    }
  };

  const onPageChange = (page: number): void => {
    if (!list) {
      return;
    }

    const totalPages = Math.ceil(list.total / filters.invitesLimit);
    const validPage = Math.max(1, Math.min(page, totalPages));

    updateFilters({
      invitesPage: validPage,
    });
  };

  useEffect(() => {
    if (!list || list.total === 0) {
      return;
    }

    const totalPages = Math.ceil(list.total / filters.invitesLimit);

    if (filters.invitesPage > totalPages) {
      updateFilters({
        invitesPage: totalPages,
      });
    }
  }, [list, filters.invitesPage, filters.invitesLimit, updateFilters]);

  if (!list || list?.total === 0) {
    return null;
  }

  return (
    <DataContainer title={tTable('userInvites')}>
      <ParticipationsTable
        items={list.invites}
        isLoading={isLoading}
        actionColumnWidth={175}
        cancel={handleCancel}
        page={filters.invitesPage}
        limit={filters.invitesLimit}
      />
      {list.total > filters.invitesLimit && (
        <Pagination
          total={list.total}
          limit={filters.invitesLimit}
          page={filters.invitesPage}
          onPageChange={onPageChange}
        />
      )}
    </DataContainer>
  );
}
