'use client';

import { Fragment, ReactElement } from 'react';
import styles from './ProfileBaseInfo.module.scss';
import Image from 'next/image';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import Button from '@/shared/components/Button/Button';
import Edit from '@/assets/icons/edit.svg';

interface ProfileBaseInfoProps {
  user: AuthInterface;
  handleEditName: () => void;
}

export default function ProfileBaseInfo(
  props: ProfileBaseInfoProps,
): ReactElement {
  const { user, handleEditName } = props;

  return (
    <div className={styles['profile-base-info']}>
      <div className={styles['profile-base-info__inner']}>
        <Image
          className={styles['profile-base-info__image']}
          src={user.avatarUrl}
          alt="bird"
          height={140}
          width={140}
        />
        <div className={styles['profile-base-info__info']}>
          <div className={styles['profile-base-info__name-wrapper']}>
            <p className={styles['profile-base-info__name']}>
              {user.firstName} {user.lastName}
            </p>
            <Button
              color="green"
              variant="secondary-frame"
              icon={<Edit />}
              onClick={handleEditName}
            />
          </div>
          <p className={styles['profile-base-info__email']}>{user.email}</p>
          <p>
            {user.desiredRoles.map((role, index) => (
              <Fragment key={index}>
                {index !== 0 && (
                  <span className={styles['profile-base-info__role']}> / </span>
                )}
                <span className={styles['profile-base-info__role']}>
                  {role.roleName}
                </span>
              </Fragment>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
