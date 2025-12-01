'use client';

import { Fragment, ReactElement } from 'react';
import styles from './UserBaseInfo.module.scss';
import { UserInterface } from '@/shared/interfaces/user.interface';
import Image from 'next/image';
import DataContainer from '@/shared/components/DataContainer/DataContainer';
import { useTranslations } from 'next-intl';

interface UserBaseInfoProps {
  user: UserInterface;
}

export default function UserBaseInfo({
  user,
}: UserBaseInfoProps): ReactElement {
  const t = useTranslations('profile');

  return (
    <DataContainer title={t('userName')}>
      <div className={styles['user-base-info']}>
        <Image
          className={styles['user-base-info__image']}
          src={user.avatarUrl}
          alt="bird"
          height={140}
          width={140}
        />
        <div className={styles['user-base-info__info']}>
          <p className={styles['user-base-info__user-name']}>
            {user.firstName} {user.lastName}
          </p>
          <p>
            {user.desiredRoles.map((role, index) => (
              <Fragment key={index}>
                {index !== 0 && (
                  <span className={styles['user-base-info__role']}> / </span>
                )}
                <span className={styles['user-base-info__role']}>
                  {role.roleName}
                </span>
              </Fragment>
            ))}
          </p>
        </div>
      </div>
    </DataContainer>
  );
}
