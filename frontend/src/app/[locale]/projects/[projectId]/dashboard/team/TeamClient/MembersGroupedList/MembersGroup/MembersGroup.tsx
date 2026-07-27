'use client';

import { ReactElement } from 'react';
import styles from './MembersGroup.module.scss';
import {
  TeamMemberInterface,
  TeamRoleGroupInterface,
} from '@/shared/interfaces/team-view-interface';
import MembersFlatList from '@/shared/components/MembersFlatList/MembersFlatList';

interface MembersGroupProps {
  group: TeamRoleGroupInterface<TeamMemberInterface>;
  isOwner: boolean;
  onDelete: (member: TeamMemberInterface) => void;
}

export default function MembersGroup(props: MembersGroupProps): ReactElement {
  const { group, isOwner, onDelete } = props;

  return (
    <section className={styles['members-group']}>
      <h3 className={styles['members-group__title']}>{group.roleName}</h3>
      <MembersFlatList
        members={group.items}
        isOwner={isOwner}
        onDelete={onDelete}
      />
    </section>
  );
}
