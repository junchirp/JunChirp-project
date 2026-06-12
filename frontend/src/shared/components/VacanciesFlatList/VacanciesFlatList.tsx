'use client';

import { ReactElement } from 'react';
import styles from './VacanciesFlatList.module.scss';
import { TeamVacancyInterface } from '@/shared/interfaces/team-view-interface';
import VacancyItem from '@/shared/components/VacancyItem/VacancyItem';
import { TeamTabType } from '@/shared/constants/team';
import RoleButton from '@/shared/components/RoleButton/RoleButton';

interface VacanciesFlatListProps {
  vacancies: TeamVacancyInterface[];
  roleId: string;
  roleName: string;
  isOwner: boolean;
  tab: TeamTabType;
  onDelete: (id: string) => void;
  onAdd: (id: string) => void;
  loading: boolean;
}

export default function VacanciesFlatList(
  props: VacanciesFlatListProps,
): ReactElement {
  const {
    vacancies,
    roleId,
    roleName,
    isOwner,
    tab,
    onDelete,
    onAdd,
    loading,
  } = props;

  return (
    <div className={styles['vacancies-flat-list']}>
      {vacancies.map((item, index) => (
        <VacancyItem
          key={index}
          vacancy={item}
          isOwner={isOwner}
          onDelete={onDelete}
          loading={loading}
        />
      ))}
      {tab === 'vacancies' && isOwner && (
        <RoleButton
          roleId={roleId}
          roleName={roleName}
          buttonName="Додати вакансію"
          onAdd={onAdd}
        />
      )}
    </div>
  );
}
