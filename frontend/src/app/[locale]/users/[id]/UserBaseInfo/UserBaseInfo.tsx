'use client';

import { ReactElement } from 'react';
import styles from './UserBaseInfo.module.scss';
import { UserInterface } from '@/shared/interfaces/user.interface';
import Image from 'next/image';
import DataContainer from '@/shared/components/DataContainer/DataContainer';

interface UserBaseInfoProps {
  user: UserInterface;
}

export default function UserBaseInfo({
  user,
}: UserBaseInfoProps): ReactElement {
  return (
    <DataContainer title="Ім'я та прізвище">
      <div className={styles['user-base-info']}>
        <Image
          className={styles['user-base-info__image']}
          src={user.avatarUrl}
          alt="bird"
          height={140}
          width={140}
        />
        <div className={styles['user-base-info__user-name']}>
          {user.firstName} {user.lastName}
        </div>
      </div>
    </DataContainer>
  );
}
