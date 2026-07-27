'use client';

import { ReactElement } from 'react';
import styles from './InvitesGroup.module.scss';
import {
  TeamInviteInterface,
  TeamRoleGroupInterface,
} from '@/shared/interfaces/team-view-interface';
import InvitesFlatList from '@/shared/components/InvitesFlatList/InvitesFlatList';

interface InvitesGroupProps {
  group: TeamRoleGroupInterface<TeamInviteInterface>;
  onCancel: (inviteId: string, userId: string) => void;
  loading: boolean;
}

export default function InvitesGroup(props: InvitesGroupProps): ReactElement {
  const { group, onCancel, loading } = props;

  return (
    <section className={styles['invites-group']}>
      <h3 className={styles['invites-group__title']}>{group.roleName}</h3>
      <InvitesFlatList
        invites={group.items}
        onCancel={onCancel}
        loading={loading}
      />
    </section>
  );
}
