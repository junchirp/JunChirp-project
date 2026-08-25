'use client';

import { ReactElement, useEffect, useState } from 'react';
import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';
import {
  useAcceptInviteMutation,
  useGetMyInvitesQuery,
} from '@/api/participationsApi';
import ParticipationsTable from '@/shared/components/ParticipationsTable/ParticipationsTable';
import DataContainer from '@/shared/components/DataContainer/DataContainer';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import RejectInvitePopup from '@/shared/components/RejectInvitePopup/RejectInvitePopup';
import { useTranslations } from 'next-intl';
import DiscordBanner from '@/shared/components/DiscordBanner/DiscordBanner';
import { useToast } from '@/hooks/useToast';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { useRouter } from '@/i18n/routing';
import { useInvitesFilters } from '@/hooks/useInvitesFilters';
import Pagination from '@/shared/components/Pagination/Pagination';

interface MyInvitesProps {
  user: AuthInterface;
}

export default function MyInvites({
  user,
}: MyInvitesProps): ReactElement | null {
  const { filters, updateFilters } = useInvitesFilters();
  const { data: list } = useGetMyInvitesQuery({
    id: user.id,
    params: {
      page: filters.invitesPage,
      limit: filters.invitesLimit,
    },
  });
  const [invite, setInvite] = useState<ProjectParticipationInterface | null>(
    null,
  );
  const tInvite = useTranslations('acceptInvite');
  const [isBanner, setBanner] = useState(false);
  const [acceptInvite, { isLoading }] = useAcceptInviteMutation();
  const tTable = useTranslations('participationsTable');
  const { showToast, isActive } = useToast();
  const router = useRouter();

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

      router.push(`/projects/${inv.projectRole.project.id}/dashboard`);
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
    <>
      <DataContainer title={tTable('myInvites')}>
        <ParticipationsTable
          items={list.invites}
          openModal={openModal}
          isLoading={isLoading}
          actionColumnWidth={280}
          page={filters.invitesPage}
          limit={filters.invitesLimit}
          accept={handleAcceptInvite}
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
      {invite && (
        <RejectInvitePopup
          onClose={closeModal}
          inviteId={invite.id}
          projectName={invite.projectRole.project.projectName}
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
