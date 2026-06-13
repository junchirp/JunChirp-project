'use client';

import { ReactElement } from 'react';
import styles from './MemberItem.module.scss';
import { TeamMemberInterface } from '@/shared/interfaces/team-view-interface';
import Image from 'next/image';
import Button from '@/shared/components/Button/Button';
import X from '@/assets/icons/x.svg';
import { Link } from '@/i18n/routing';

interface MemberItemProps {
  member: TeamMemberInterface;
  isOwner: boolean;
  onDelete: (member: TeamMemberInterface) => void;
}

export default function MemberItem(props: MemberItemProps): ReactElement {
  const { member, isOwner, onDelete } = props;

  return (
    <div className={styles['member-item']}>
      <Image
        className={styles['member-item__image']}
        src={member.user.avatarUrl}
        alt="bird"
        height={156}
        width={156}
      />
      <div className={styles['member-item__details']}>
        <div className={styles['member-item__user']}>
          <div className={styles['member-item__role']}>{member.roleName}</div>
          <Link
            className={styles['member-item__link']}
            href={`/users/${member.user.id}`}
          >
            {member.user.firstName} {member.user.lastName}
          </Link>
        </div>
        {isOwner && (
          <div className={styles['member-item__actions']}>
            <Button
              variant="tertiary"
              icon={<X />}
              onClick={() => onDelete(member)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
