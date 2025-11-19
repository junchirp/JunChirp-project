'use client';

import { ReactElement } from 'react';
import styles from './ProfileAction.module.scss';
import { ProfileActionType } from '@/shared/types/profile-action.type';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface ProfileActionProps {
  action: ProfileActionType;
}

export default function ProfileAction({
  action,
}: ProfileActionProps): ReactElement {
  const t = useTranslations('profile');

  return (
    <div className={styles['profile-action']}>
      {action && (
        <p className={styles['profile-action__description']}>
          {t(action?.key)}
        </p>
      )}
      <Image
        src="/images/arrow-right.svg"
        alt="arrow"
        width={160}
        height={160}
      />
    </div>
  );
}
