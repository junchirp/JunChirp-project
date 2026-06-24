'use client';

import { ReactElement } from 'react';
import styles from './UsersFilters.module.scss';
import UsersFiltersForm from './UsersFiltersForm/UsersFiltersForm';
import { useTranslations } from 'next-intl';

export default function UsersFilters(): ReactElement {
  const t = useTranslations('usersPage');

  return (
    <div className={styles['users-filters']}>
      <h3 className={styles['users-filters__title']}>{t('filterName')}:</h3>
      <UsersFiltersForm />
      <div className={styles['users-filters__border']}></div>
    </div>
  );
}
