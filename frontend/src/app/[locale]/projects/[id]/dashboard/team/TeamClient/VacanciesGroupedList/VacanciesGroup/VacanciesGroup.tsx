'use client';

import { ReactElement } from 'react';
import styles from './VacanciesGroup.module.scss';
import {
  TeamRoleGroupInterface,
  TeamVacancyInterface,
} from '@/shared/interfaces/team-view-interface';
import VacanciesFlatList from '@/shared/components/VacanciesFlatList/VacanciesFlatList';
import { TeamTabType } from '@/shared/constants/team';

interface VacanciesGroupProps {
  group: TeamRoleGroupInterface<TeamVacancyInterface>;
  isOwner: boolean;
  tab: TeamTabType;
  onDelete: (id: string) => void;
  onAdd: (id: string) => void;
  loading: boolean;
}

export default function VacanciesGroup(
  props: VacanciesGroupProps,
): ReactElement {
  const { group, isOwner, tab, onDelete, onAdd, loading } = props;

  return (
    <section className={styles['vacancies-group']}>
      <h3 className={styles['vacancies-group__title']}>{group.roleName}</h3>
      <VacanciesFlatList
        vacancies={group.items}
        isOwner={isOwner}
        tab={tab}
        roleId={group.roleId}
        roleName={group.roleName}
        onDelete={onDelete}
        onAdd={onAdd}
        loading={loading}
      />
    </section>
  );
}
