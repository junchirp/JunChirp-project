'use client';

import { ReactElement } from 'react';
import styles from './VacanciesGroupedList.module.scss';
import {
  TeamRoleGroupInterface,
  TeamVacancyInterface,
} from '@/shared/interfaces/team-view-interface';
import VacanciesGroup from './VacanciesGroup/VacanciesGroup';
import { TeamTabType } from '@/shared/constants/team';

interface VacanciesGroupedListProps {
  vacancies: TeamRoleGroupInterface<TeamVacancyInterface>[];
  isOwner: boolean;
  tab: TeamTabType;
  onDelete: (id: string) => void;
  onAdd: (id: string) => void;
  loading: boolean;
}

export default function VacanciesGroupedList(
  props: VacanciesGroupedListProps,
): ReactElement {
  const { vacancies, isOwner, tab, onDelete, onAdd, loading } = props;

  return (
    <div className={styles['vacancies-grouped-list']}>
      {vacancies.map((group) => (
        <VacanciesGroup
          key={group.roleId}
          group={group}
          isOwner={isOwner}
          tab={tab}
          onDelete={onDelete}
          onAdd={onAdd}
          loading={loading}
        />
      ))}
    </div>
  );
}
