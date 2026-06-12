'use client';

import { ReactElement } from 'react';
import styles from './VacancyItem.module.scss';
import { TeamVacancyInterface } from '@/shared/interfaces/team-view-interface';
import Image from 'next/image';
import Button from '@/shared/components/Button/Button';
import X from '@/assets/icons/x.svg';

interface VacancyItemProps {
  vacancy: TeamVacancyInterface;
  isOwner: boolean;
  onDelete: (id: string) => void;
  loading: boolean;
}

export default function VacancyItem(props: VacancyItemProps): ReactElement {
  const { vacancy, isOwner, onDelete, loading } = props;

  return (
    <div className={styles['vacancy-item']}>
      <div className={styles['vacancy-item__image-wrapper']}>
        <Image src="/images/user.svg" alt="user" height={100} width={100} />
      </div>
      <div className={styles['vacancy-item__details']}>
        <div className={styles['vacancy-item__role']}>{vacancy.roleName}</div>
        {isOwner && (
          <div className={styles['vacancy-item__actions']}>
            <Button
              variant="tertiary"
              icon={<X />}
              loading={loading}
              onClick={() => onDelete(vacancy.roleId)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
