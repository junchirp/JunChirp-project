'use client';

import { ReactElement } from 'react';
import styles from './RequestsGroup.module.scss';
import {
  TeamRequestInterface,
  TeamRoleGroupInterface,
} from '@/shared/interfaces/team-view-interface';
import RequestsFlatList from '@/shared/components/RequestsFlatList/RequestsFlatList';

interface RequestsGroupProps {
  group: TeamRoleGroupInterface<TeamRequestInterface>;
  onDecline: (request: TeamRequestInterface) => void;
  onAccept: (requestId: string, userId: string) => void;
  acceptLoading: boolean;
}

export default function RequestsGroup(props: RequestsGroupProps): ReactElement {
  const { group, onDecline, onAccept, acceptLoading } = props;

  return (
    <section className={styles['requests-group']}>
      <h3 className={styles['requests-group__title']}>{group.roleName}</h3>
      <RequestsFlatList
        requests={group.items}
        onDecline={onDecline}
        onAccept={onAccept}
        acceptLoading={acceptLoading}
      />
    </section>
  );
}
