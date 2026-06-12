'use client';

import { ReactElement } from 'react';
import styles from './RequestsGroupedList.module.scss';
import {
  TeamRequestInterface,
  TeamRoleGroupInterface,
} from '@/shared/interfaces/team-view-interface';
import RequestsGroup from './RequestsGroup/RequestsGroup';

interface RequestsGroupedListProps {
  requests: TeamRoleGroupInterface<TeamRequestInterface>[];
  onDecline: (request: TeamRequestInterface) => void;
  onAccept: (requestId: string, userId: string) => void;
  acceptLoading: boolean;
}

export default function RequestsGroupedList(
  props: RequestsGroupedListProps,
): ReactElement {
  const { requests, onAccept, onDecline, acceptLoading } = props;

  return (
    <div className={styles['requests-grouped-list']}>
      {requests.map((group) => (
        <RequestsGroup
          key={group.roleId}
          group={group}
          onDecline={onDecline}
          onAccept={onAccept}
          acceptLoading={acceptLoading}
        />
      ))}
    </div>
  );
}
