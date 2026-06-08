'use client';

import { ReactElement } from 'react';
import styles from './AllGroup.module.scss';
import {
  TeamMemberInterface, TeamRequestInterface,
  TeamRoleAllGroupInterface,
} from '@/shared/interfaces/team-view-interface';
import AllFlatList from '@/shared/components/AllFlatList/AllFlatList';

interface AllGroupProps {
  group: TeamRoleAllGroupInterface;
  isOwner: boolean;
  onDeleteMember: (member: TeamMemberInterface) => void;
  onDeleteVacancy: (id: string) => void;
  onDeclineRequest: (request: TeamRequestInterface) => void;
  onAcceptRequest: (requestId: string, userId: string) => void;
  onCancelInvite: (inviteId: string, userId: string) => void;
  inviteLoading: boolean;
  acceptRequestLoading: boolean;
}

export default function AllGroup(props: AllGroupProps): ReactElement {
  const {
    group,
    onCancelInvite,
    onDeclineRequest,
    onAcceptRequest,
    onDeleteVacancy,
    onDeleteMember,
    isOwner,
    inviteLoading,
    acceptRequestLoading,
  } = props;

  return (
    <section className={styles['all-group']}>
      <h3 className={styles['all-group__title']}>{group.roleName}</h3>
      <AllFlatList
        items={group.items}
        isOwner={isOwner}
        onDeleteMember={onDeleteMember}
        onDeleteVacancy={onDeleteVacancy}
        onDeclineRequest={onDeclineRequest}
        onAcceptRequest={onAcceptRequest}
        onCancelInvite={onCancelInvite}
        inviteLoading={inviteLoading}
        acceptRequestLoading={acceptRequestLoading}
      />
    </section>
  );
}
