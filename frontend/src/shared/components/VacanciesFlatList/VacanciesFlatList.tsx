'use client';

import { ReactElement } from 'react';
import styles from './VacanciesFlatList.module.scss';
import { TeamVacancyInterface } from '@/shared/interfaces/team-view-interface';
import VacancyItem from '@/shared/components/VacancyItem/VacancyItem';

interface VacanciesFlatListProps {
  vacancies: TeamVacancyInterface[];
  isOwner: boolean;
  onDelete: (id: string) => void;
}

export default function VacanciesFlatList(
  props: VacanciesFlatListProps,
): ReactElement {
  const { vacancies, isOwner, onDelete } = props;

  return (
    <div className={styles['vacancies-flat-list']}>
      {vacancies.map((item, index) => (
        <VacancyItem
          key={index}
          vacancy={item}
          isOwner={isOwner}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
