'use client';

import { ReactElement } from 'react';
import styles from './VacanciesGroup.module.scss';
import {
  TeamRoleGroupInterface,
  TeamVacancyInterface,
} from '@/shared/interfaces/team-view-interface';
import VacanciesFlatList from '@/shared/components/VacanciesFlatList/VacanciesFlatList';

interface VacanciesGroupProps {
  group: TeamRoleGroupInterface<TeamVacancyInterface>;
  isOwner: boolean;
  onDelete: (id: string) => void;
}

export default function VacanciesGroup(
  props: VacanciesGroupProps,
): ReactElement {
  const { group, isOwner, onDelete } = props;

  return (
    <section className={styles['vacancies-group']}>
      <h3 className={styles['vacancies-group__title']}>{group.roleName}</h3>
      <VacanciesFlatList
        vacancies={group.items}
        isOwner={isOwner}
        onDelete={onDelete}
      />
    </section>
  );
}
