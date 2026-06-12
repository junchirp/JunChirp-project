'use client';

import { ReactElement } from 'react';
import styles from './InviteItem.module.scss';
import { TeamInviteInterface } from '@/shared/interfaces/team-view-interface';
import Image from 'next/image';
import Button from '@/shared/components/Button/Button';
import X from '@/assets/icons/x.svg';
import { Link } from '@/i18n/routing';

interface InviteItemProps {
  invite: TeamInviteInterface;
  onCancel: (inviteId: string, userId: string) => void;
  loading: boolean;
}

export default function InviteItem(props: InviteItemProps): ReactElement {
  const { invite, onCancel, loading } = props;

  return (
    <div className={styles['invite-item']}>
      <Image
        className={styles['invite-item__image']}
        src={invite.invite.user.avatarUrl}
        alt="bird"
        height={156}
        width={156}
      />
      <div className={styles['invite-item__details']}>
        <div className={styles['invite-item__user']}>
          <div className={styles['invite-item__role']}>
            {invite.invite.projectRole.roleType.roleName}
          </div>
          <Link
            className={styles['invite-item__link']}
            href={`/users/${invite.invite.user.id}`}
          >
            {invite.invite.user.firstName} {invite.invite.user.lastName}
          </Link>
        </div>
        <div className={styles['invite-item__actions']}>
          <Button
            variant="tertiary"
            icon={<X />}
            loading={loading}
            onClick={() => onCancel(invite.invite.id, invite.invite.user.id)}
          />
        </div>
      </div>
    </div>
  );
}
