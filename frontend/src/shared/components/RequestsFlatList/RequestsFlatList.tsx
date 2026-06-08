'use client';

import { ReactElement } from 'react';
import styles from './RequestsFlatList.module.scss';
import { TeamRequestInterface } from '@/shared/interfaces/team-view-interface';
import RequestItem from '@/shared/components/RequestItem/RequestItem';

interface RequestsFlatListProps {
  requests: TeamRequestInterface[];
  onDecline: (request: TeamRequestInterface) => void;
  onAccept: (requestId: string, userId: string) => void;
  acceptLoading: boolean;
}

export default function RequestsFlatList(
  props: RequestsFlatListProps,
): ReactElement {
  const { requests, onDecline, onAccept, acceptLoading } = props;

  return (
    <div className={styles['requests-flat-list']}>
      {requests.map((item) => (
        <RequestItem
          key={item.request.id}
          request={item}
          onDecline={onDecline}
          onAccept={onAccept}
          acceptLoading={acceptLoading}
        />
      ))}
    </div>
  );
}
