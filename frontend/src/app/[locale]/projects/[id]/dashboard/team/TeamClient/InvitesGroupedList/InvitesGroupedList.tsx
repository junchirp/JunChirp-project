'use client';

import { ReactElement } from 'react';
import styles from './InvitesGroupedList.module.scss';
import {
  TeamInviteInterface,
  TeamRoleGroupInterface,
} from '@/shared/interfaces/team-view-interface';
import InvitesGroup from './InvitesGroup/InvitesGroup';

interface InvitesGroupedListProps {
  invites: TeamRoleGroupInterface<TeamInviteInterface>[];
  onCancel: (inviteId: string, userId: string) => void;
  loading: boolean;
}

export default function InvitesGroupedList(
  props: InvitesGroupedListProps,
): ReactElement {
  const { invites, onCancel, loading } = props;

  return (
    <div className={styles['members-grouped-list']}>
      {invites.map((group) => (
        <InvitesGroup
          key={group.roleId}
          group={group}
          onCancel={onCancel}
          loading={loading}
        />
      ))}
    </div>
  );
}
