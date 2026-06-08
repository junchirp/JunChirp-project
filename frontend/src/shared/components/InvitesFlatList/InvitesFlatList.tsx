'use client';

import { ReactElement } from 'react';
import styles from './InvitesFlatList.module.scss';
import { TeamInviteInterface } from '@/shared/interfaces/team-view-interface';
import InviteItem from '@/shared/components/InviteItem/InviteItem';

interface InvitesFlatListProps {
  invites: TeamInviteInterface[];
  onCancel: (inviteId: string, userId: string) => void;
  loading: boolean;
}

export default function InvitesFlatList(
  props: InvitesFlatListProps,
): ReactElement {
  const { invites, onCancel, loading } = props;

  return (
    <div className={styles['invites-flat-list']}>
      {invites.map((item) => (
        <InviteItem
          key={item.invite.id}
          invite={item}
          onCancel={onCancel}
          loading={loading}
        />
      ))}
    </div>
  );
}
