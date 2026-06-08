'use client';

import { ReactElement } from 'react';
import styles from './MembersFlatList.module.scss';
import { TeamMemberInterface } from '@/shared/interfaces/team-view-interface';
import MemberItem from '@/shared/components/MemberItem/MemberItem';

interface MembersFlatListProps {
  members: TeamMemberInterface[];
  isOwner: boolean;
  onDelete: (member: TeamMemberInterface) => void;
}

export default function MembersFlatList(
  props: MembersFlatListProps,
): ReactElement {
  const { members, isOwner, onDelete } = props;

  return (
    <div className={styles['members-flat-list']}>
      {members.map((item) => (
        <MemberItem
          key={item.user.id}
          member={item}
          isOwner={isOwner}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
