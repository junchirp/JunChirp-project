'use client';

import { ReactElement } from 'react';
import styles from './VacanciesGroupedList.module.scss';
import {
  TeamRoleGroupInterface,
  TeamVacancyInterface,
} from '@/shared/interfaces/team-view-interface';
import VacanciesGroup from './VacanciesGroup/VacanciesGroup';

interface VacanciesGroupedListProps {
  vacancies: TeamRoleGroupInterface<TeamVacancyInterface>[];
  isOwner: boolean;
  onDelete: (id: string) => void;
}

export default function VacanciesGroupedList(
  props: VacanciesGroupedListProps,
): ReactElement {
  const { vacancies, isOwner, onDelete } = props;

  return (
    <div className={styles['vacancies-grouped-list']}>
      {vacancies.map((group) => (
        <VacanciesGroup
          key={group.roleId}
          group={group}
          isOwner={isOwner}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
