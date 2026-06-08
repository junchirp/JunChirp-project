'use client';

import { ReactElement } from 'react';
import styles from './RequestItem.module.scss';
import Image from 'next/image';
import Button from '@/shared/components/Button/Button';
import X from '@/assets/icons/x.svg';
import Check from '@/assets/icons/check.svg';
import { Link } from '@/i18n/routing';
import { TeamRequestInterface } from '@/shared/interfaces/team-view-interface';

interface RequestItemProps {
  request: TeamRequestInterface;
  onDecline: (request: TeamRequestInterface) => void;
  onAccept: (requestId: string, userId: string) => void;
  acceptLoading: boolean;
}

export default function RequestItem(props: RequestItemProps): ReactElement {
  const { request, onDecline, onAccept, acceptLoading } = props;

  return (
    <div className={styles['request-item']}>
      <Image
        className={styles['request-item__image']}
        src={request.request.user.avatarUrl}
        alt="bird"
        height={156}
        width={156}
      />
      <div className={styles['request-item__details']}>
        <div className={styles['request-item__user']}>
          <div className={styles['request-item__role']}>
            {request.request.projectRole.roleType.roleName}
          </div>
          <Link
            className={styles['request-item__link']}
            href={`/users/${request.request.user.id}`}
          >
            {request.request.user.firstName} {request.request.user.lastName}
          </Link>
        </div>
        <div className={styles['request-item__actions']}>
          <Button
            variant="tertiary"
            icon={<Check />}
            onClick={() =>
              onAccept(request.request.id, request.request.user.id)
            }
            loading={acceptLoading}
          />
          <Button
            variant="tertiary"
            icon={<X />}
            onClick={() => onDecline(request)}
          />
        </div>
      </div>
    </div>
  );
}
