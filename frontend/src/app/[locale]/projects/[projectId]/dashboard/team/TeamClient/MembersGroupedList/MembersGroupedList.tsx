'use client';

import { ReactElement } from 'react';
import styles from './MembersGroupedList.module.scss';
import {
  TeamMemberInterface,
  TeamRoleGroupInterface,
} from '@/shared/interfaces/team-view-interface';
import MembersGroup from './MembersGroup/MembersGroup';

interface MembersGroupedListProps {
  members: TeamRoleGroupInterface<TeamMemberInterface>[];
  isOwner: boolean;
  onDelete: (member: TeamMemberInterface) => void;
}

export default function MembersGroupedList(
  props: MembersGroupedListProps,
): ReactElement {
  const { members, isOwner, onDelete } = props;

  return (
    <div className={styles['members-grouped-list']}>
      {members.map((group) => (
        <MembersGroup
          key={group.roleId}
          group={group}
          isOwner={isOwner}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
