'use client';

import { ReactElement } from 'react';
import styles from './AllGroupedList.module.scss';
import {
  TeamMemberInterface,
  TeamRequestInterface,
  TeamRoleAllGroupInterface,
} from '@/shared/interfaces/team-view-interface';
import AllGroup from './AllGroup/AllGroup';

interface AllGroupedListProps {
  items: TeamRoleAllGroupInterface[];
  isOwner: boolean;
  onDeleteMember: (member: TeamMemberInterface) => void;
  onDeleteVacancy: (id: string) => void;
  onDeclineRequest: (request: TeamRequestInterface) => void;
  onAcceptRequest: (requestId: string, userId: string) => void;
  onCancelInvite: (inviteId: string, userId: string) => void;
  inviteLoading: boolean;
  acceptRequestLoading: boolean;
}

export default function AllGroupedList(
  props: AllGroupedListProps,
): ReactElement {
  const {
    items,
    isOwner,
    onCancelInvite,
    onDeclineRequest,
    onAcceptRequest,
    onDeleteVacancy,
    onDeleteMember,
    inviteLoading,
    acceptRequestLoading,
  } = props;

  return (
    <div className={styles['all-grouped-list']}>
      {items.map((group) => (
        <AllGroup
          key={group.roleId}
          group={group}
          isOwner={isOwner}
          onCancelInvite={onCancelInvite}
          onDeclineRequest={onDeclineRequest}
          onAcceptRequest={onAcceptRequest}
          onDeleteVacancy={onDeleteVacancy}
          onDeleteMember={onDeleteMember}
          inviteLoading={inviteLoading}
          acceptRequestLoading={acceptRequestLoading}
        />
      ))}
    </div>
  );
}
