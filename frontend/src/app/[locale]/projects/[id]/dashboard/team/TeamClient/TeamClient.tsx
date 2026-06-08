'use client';

import { ReactElement, useEffect, useMemo, useState } from 'react';
import styles from './TeamClient.module.scss';
import { useParams, useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import {
  useDeleteUserFromProjectMutation,
  useGetInvitesByProjectIdQuery,
  useGetProjectByIdQuery,
  useGetRequestsByProjectIdQuery,
} from '@/api/projectsApi';
import { buildTeamViewModel } from '@/shared/utils/biuldTeamViewModel';
import { useRouter } from '@/i18n/routing';
import { getValidParam } from '@/shared/utils/getValidParam';
import {
  TEAM_TABS,
  TeamCtxInterface,
  TeamTabInterface,
  TeamTabType,
  TeamViewType,
  VALID_TEAM_TABS,
  VALID_TEAM_VIEWS,
} from '@/shared/constants/team';
import TeamControls from './TeamControls/TeamControls';
import MembersFlatList from '@/shared/components/MembersFlatList/MembersFlatList';
import VacanciesFlatList from '@/shared/components/VacanciesFlatList/VacanciesFlatList';
import RequestsFlatList from '@/shared/components/RequestsFlatList/RequestsFlatList';
import InvitesFlatList from '@/shared/components/InvitesFlatList/InvitesFlatList';
import AllFlatList from '@/shared/components/AllFlatList/AllFlatList';
import VacanciesGroupedList from './VacanciesGroupedList/VacanciesGroupedList';
import MembersGroupedList from './MembersGroupedList/MembersGroupedList';
import RequestsGroupedList from './RequestsGroupedList/RequestsGroupedList';
import InvitesGroupedList from './InvitesGroupedList/InvitesGroupedList';
import AllGroupedList from './AllGroupedList/AllGroupedList';
import DeleteMemberPopup from './DeleteMemberPopup/DeleteMemberPopup';
import {
  TeamMemberInterface,
  TeamRequestInterface,
} from '@/shared/interfaces/team-view-interface';
import { useToast } from '@/hooks/useToast';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import {
  useAcceptRequestMutation,
  useCancelInviteMutation,
  useDeclineRequestMutation,
} from '@/api/participationsApi';
import { useTranslations } from 'next-intl';
import { UserParticipationInterface } from '@/shared/interfaces/user-participation.interface';
import { UserCardInterface } from '@/shared/interfaces/user-card.interface';
import DeclineRequestPopup from '@/shared/components/DeclineRequestPopup/DeclineRequestPopup';

export default function TeamClient(): ReactElement {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const rawTab = searchParams.get('tab');
  const rawView = searchParams.get('view');
  const tab = getValidParam(rawTab, VALID_TEAM_TABS, 'all');
  const view = getValidParam(rawView, VALID_TEAM_VIEWS, 'flat');
  const user = useAppSelector(authSelector.selectRequiredUser);
  const { data: project, isLoading: projectLoading } =
    useGetProjectByIdQuery(id);
  const { data: invites = [], isLoading: invitesLoading } =
    useGetInvitesByProjectIdQuery(id);
  const { data: requests = [], isLoading: requestsLoading } =
    useGetRequestsByProjectIdQuery(id);
  const isLoading = projectLoading || invitesLoading || requestsLoading;
  const isOwner = user.id === project?.ownerId;
  const router = useRouter();
  const [member, setMember] = useState<UserCardInterface | null>(null);
  const [request, setRequest] = useState<UserParticipationInterface | null>(
    null,
  );
  const [deleteMember, { isLoading: deleteMemberLoading }] =
    useDeleteUserFromProjectMutation();
  const [acceptRequest, { isLoading: acceptRequestLoading }] =
    useAcceptRequestMutation();
  const [cancelInvite, { isLoading: cancelInviteLoading }] =
    useCancelInviteMutation();
  const [declineRequest, { isLoading: declineRequestLoading }] =
    useDeclineRequestMutation();
  const { showToast, isActive } = useToast();
  const t = useTranslations('team');

  const openDeleteMemberPopup = (m: TeamMemberInterface): void =>
    setMember(m.user);
  const closeDeleteMemberPopup = (): void => setMember(null);
  const openDeclineRequestPopup = (r: TeamRequestInterface): void =>
    setRequest(r.request);
  const closeDeclineRequestPopup = (): void => setRequest(null);

  const teamViewModel = useMemo(
    () => buildTeamViewModel({ project, requests, invites, isOwner }),
    [project, requests, invites, isOwner],
  );

  const ctx: TeamCtxInterface = {
    isOwner,
    members: teamViewModel.flat.members.length,
    requests: teamViewModel.flat.requests.length,
    invitations: teamViewModel.flat.invitations.length,
    vacancies: teamViewModel.flat.vacancies.length,
  };

  const activeTab: TeamTabType =
    TEAM_TABS[tab].getState(ctx) === 'hidden' ||
    TEAM_TABS[tab].getState(ctx) === 'disabled'
      ? TEAM_TABS[tab].fallback
      : tab;

  const tabs: TeamTabInterface[] = VALID_TEAM_TABS.filter(
    (tb) => TEAM_TABS[tb].getState(ctx) !== 'hidden',
  ).map((tb) => {
    const config = TEAM_TABS[tb];
    const count = config.getCount(ctx);

    return {
      key: tb,
      count,
      disabled: count === 0,
      active: activeTab === tb,
    };
  });

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const shouldRedirect = rawTab !== activeTab || rawView !== view;

    if (shouldRedirect) {
      router.replace(
        `/projects/${id}/dashboard/team?tab=${activeTab}&view=${view}`,
      );
    }
  }, [isLoading, tab, activeTab, view, id, router]);

  const changeTab = (tb: TeamTabType): void => {
    if (TEAM_TABS[tb].getState(ctx) === 'hidden') {
      return;
    }

    router.replace(`/projects/${id}/dashboard/team?tab=${tb}&view=${view}`);
  };

  const changeView = (v: TeamViewType): void => {
    router.replace(`/projects/${id}/dashboard/team?tab=${activeTab}&view=${v}`);
  };

  const handleDeleteMember = async (userId: string): Promise<void> => {
    if (isActive(ToastKeysEnum.MEMBER)) {
      return;
    }

    try {
      await deleteMember({ id, userId }).unwrap();

      showToast({
        severity: 'success',
        summary: t('deleteMember.success'),
        life: 3000,
        actionKey: ToastKeysEnum.MEMBER,
      });
    } catch {
      showToast({
        severity: 'error',
        summary: t('deleteMember.error'),
        life: 3000,
        actionKey: ToastKeysEnum.MEMBER,
      });
    } finally {
      closeDeleteMemberPopup();
    }
  };

  const deleteVacancy = (id: string): void => {};

  const handleDeclineRequest = async (
    requestId: string,
    userId: string,
  ): Promise<void> => {
    if (isActive(ToastKeysEnum.PARTICIPATION_REQUEST)) {
      return;
    }

    try {
      await declineRequest({ id: requestId, userId, projectId: id });

      showToast({
        severity: 'success',
        summary: t('declineRequest.success'),
        life: 3000,
        actionKey: ToastKeysEnum.PARTICIPATION_REQUEST,
      });
    } catch {
      showToast({
        severity: 'error',
        summary: t('declineRequest.error'),
        detail: t('declineRequest.errorDetails'),
        life: 3000,
        actionKey: ToastKeysEnum.PARTICIPATION_REQUEST,
      });
    } finally {
      closeDeclineRequestPopup();
    }
  };

  const handleAcceptRequest = async (
    requestId: string,
    userId: string,
  ): Promise<void> => {
    if (isActive(ToastKeysEnum.PARTICIPATION_REQUEST)) {
      return;
    }

    try {
      await acceptRequest({ id: requestId, userId, projectId: id });

      showToast({
        severity: 'success',
        summary: t('acceptRequest.success'),
        life: 3000,
        actionKey: ToastKeysEnum.PARTICIPATION_REQUEST,
      });
    } catch {
      showToast({
        severity: 'error',
        summary: t('acceptRequest.error'),
        detail: t('acceptRequest.errorDetails'),
        life: 3000,
        actionKey: ToastKeysEnum.PARTICIPATION_REQUEST,
      });
    }
  };

  const handleCancelInvite = async (
    inviteId: string,
    userId: string,
  ): Promise<void> => {
    if (isActive(ToastKeysEnum.PARTICIPATION_INVITE)) {
      return;
    }

    try {
      await cancelInvite({ id: inviteId, userId, projectId: id }).unwrap();

      showToast({
        severity: 'success',
        summary: t('cancelInvite.success'),
        life: 3000,
        actionKey: ToastKeysEnum.PARTICIPATION_INVITE,
      });
    } catch {
      showToast({
        severity: 'error',
        summary: t('cancelInvite.error'),
        detail: t('cancelInvite.errorDetails'),
        life: 3000,
        actionKey: ToastKeysEnum.PARTICIPATION_INVITE,
      });
    }
  };

  const renderFlat = (): ReactElement | null => {
    switch (activeTab) {
      case 'members':
        return (
          <MembersFlatList
            members={teamViewModel.flat.members}
            isOwner={isOwner}
            onDelete={openDeleteMemberPopup}
          />
        );

      case 'requests':
        return isOwner ? (
          <RequestsFlatList
            requests={teamViewModel.flat.requests}
            onDecline={openDeclineRequestPopup}
            onAccept={handleAcceptRequest}
            acceptLoading={acceptRequestLoading}
          />
        ) : null;

      case 'invitations':
        return isOwner ? (
          <InvitesFlatList
            invites={teamViewModel.flat.invitations}
            onCancel={handleCancelInvite}
            loading={cancelInviteLoading}
          />
        ) : null;

      case 'vacancies':
        return (
          <VacanciesFlatList
            vacancies={teamViewModel.flat.vacancies}
            isOwner={isOwner}
            onDelete={deleteVacancy}
          />
        );

      case 'all':
        return (
          <AllFlatList
            items={teamViewModel.flat.all}
            isOwner={isOwner}
            onDeleteMember={openDeleteMemberPopup}
            onDeleteVacancy={deleteVacancy}
            onDeclineRequest={openDeclineRequestPopup}
            onAcceptRequest={handleAcceptRequest}
            onCancelInvite={handleCancelInvite}
            inviteLoading={cancelInviteLoading}
            acceptRequestLoading={acceptRequestLoading}
          />
        );
    }
  };

  const renderGrouped = (): ReactElement | null => {
    switch (activeTab) {
      case 'members':
        return (
          <MembersGroupedList
            members={teamViewModel.grouped.members}
            isOwner={isOwner}
            onDelete={openDeleteMemberPopup}
          />
        );

      case 'requests':
        return isOwner ? (
          <RequestsGroupedList
            requests={teamViewModel.grouped.requests}
            onDecline={openDeclineRequestPopup}
            onAccept={handleAcceptRequest}
            acceptLoading={acceptRequestLoading}
          />
        ) : null;

      case 'invitations':
        return isOwner ? (
          <InvitesGroupedList
            invites={teamViewModel.grouped.invitations}
            onCancel={handleCancelInvite}
            loading={cancelInviteLoading}
          />
        ) : null;

      case 'vacancies':
        return (
          <VacanciesGroupedList
            vacancies={teamViewModel.grouped.vacancies}
            isOwner={isOwner}
            onDelete={deleteVacancy}
          />
        );

      case 'all':
        return (
          <AllGroupedList
            items={teamViewModel.grouped.all}
            isOwner={isOwner}
            onDeleteMember={openDeleteMemberPopup}
            onDeleteVacancy={deleteVacancy}
            onDeclineRequest={openDeclineRequestPopup}
            onAcceptRequest={handleAcceptRequest}
            onCancelInvite={handleCancelInvite}
            inviteLoading={cancelInviteLoading}
            acceptRequestLoading={acceptRequestLoading}
          />
        );
    }
  };

  const renderContent = (): ReactElement | null => {
    if (view === 'flat') {
      return renderFlat();
    }

    return renderGrouped();
  };

  return (
    <>
      <div className={styles['team-client']}>
        <TeamControls
          tabs={tabs}
          view={view}
          onTabChange={changeTab}
          onViewChange={changeView}
        />
        <>{renderContent()}</>
      </div>
      {member && (
        <DeleteMemberPopup
          isOpen={!!member}
          onClose={closeDeleteMemberPopup}
          member={member}
          onDelete={handleDeleteMember}
          loading={deleteMemberLoading}
        />
      )}
      {request && project && (
        <DeclineRequestPopup
          onClose={closeDeclineRequestPopup}
          isOpen={!!(request && project)}
          loading={declineRequestLoading}
          onConfirm={handleDeclineRequest}
          data={{
            id: request.id,
            userId: request.user.id,
            userName: `${request.user.firstName} ${request.user.lastName}`,
            projectId: project.id,
            projectName: project.projectName,
            roleId: request.projectRole.id,
          }}
        />
      )}
    </>
  );
}
