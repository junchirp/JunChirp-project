'use client';

import { ReactElement } from 'react';
import styles from './AllGroupedList.module.scss';
import {
  TeamMemberInterface,
  TeamRequestInterface,
  TeamRoleAllGroupInterface,
} from '@/shared/interfaces/team-view-interface';
import AllGroup from './AllGroup/AllGroup';
import { TeamTabType } from '@/shared/constants/team';

interface AllGroupedListProps {
  items: TeamRoleAllGroupInterface[];
  isOwner: boolean;
  tab: TeamTabType;
  onDeleteMember: (member: TeamMemberInterface) => void;
  onDeleteVacancy: (id: string) => void;
  onDeclineRequest: (request: TeamRequestInterface) => void;
  onAcceptRequest: (requestId: string, userId: string) => void;
  onCancelInvite: (inviteId: string, userId: string) => void;
  onAddVacancy: (id: string) => void;
  inviteLoading: boolean;
  acceptRequestLoading: boolean;
  vacancyLoading: boolean;
}

export default function AllGroupedList(
  props: AllGroupedListProps,
): ReactElement {
  const {
    items,
    isOwner,
    tab,
    onCancelInvite,
    onDeclineRequest,
    onAcceptRequest,
    onDeleteVacancy,
    onDeleteMember,
    onAddVacancy,
    inviteLoading,
    acceptRequestLoading,
    vacancyLoading,
  } = props;

  return (
    <div className={styles['all-grouped-list']}>
      {items.map((group) => (
        <AllGroup
          key={group.roleId}
          group={group}
          isOwner={isOwner}
          tab={tab}
          onCancelInvite={onCancelInvite}
          onDeclineRequest={onDeclineRequest}
          onAcceptRequest={onAcceptRequest}
          onDeleteVacancy={onDeleteVacancy}
          onDeleteMember={onDeleteMember}
          onAddVacancy={onAddVacancy}
          inviteLoading={inviteLoading}
          acceptRequestLoading={acceptRequestLoading}
          vacancyLoading={vacancyLoading}
        />
      ))}
    </div>
  );
}
