'use client';

import { ReactElement, useState } from 'react';
import styles from './UserDetails.module.scss';
import Button from '@/shared/components/Button/Button';
import Up from '@/assets/icons/chevron-up.svg';
import Down from '@/assets/icons/chevron-down.svg';
import { useColumns } from '@/hooks/useColumns';
import { WithIdInterface } from '@/shared/interfaces/with-id.interface';
import { SoftSkillInterface } from '@/shared/interfaces/soft-skill.interface';
import { HardSkillInterface } from '@/shared/interfaces/hard-skill.interface';
import { EducationInterface } from '@/shared/interfaces/education.interface';
import { SocialInterface } from '@/shared/interfaces/social.interface';
import UserDetailsItem from '@/app/users/[id]/UserDetails/UserDetailsItem/UserDetailsItem';
import { EmailWithIdInterface } from '@/shared/interfaces/email-with-id.interface';
import { isEducation } from '../../../../shared/utils/typeGuards';

interface UserDetailsProps<
  T extends WithIdInterface =
    | SoftSkillInterface
    | HardSkillInterface
    | EducationInterface
    | (SocialInterface | EmailWithIdInterface),
> {
  title: string;
  items: T[];
  columnsCount?: number;
}

export default function UserDetails<T extends WithIdInterface>({
  title,
  items,
  columnsCount,
}: UserDetailsProps<T>): ReactElement {
  const columns = useColumns({
    fixed: columnsCount,
  });
  const classNameList =
    columns === 1
      ? styles['user-details__list']
      : `${styles['user-details__list']} ${styles['user-details__list--two-columns']}`;
  const classNameContainer =
    columns === 1
      ? styles['user-details']
      : `${styles['user-details']} ${styles['user-details--two-columns']}`;
  const classNameEmptyContainer = !items.length
    ? `${styles['user-details--no-gap']}`
    : '';

  const collapseLimit = items.length
    ? isEducation(items[0])
      ? 2
      : columns === 1
        ? 3
        : 6
    : 0;

  const [isCollapsed, setIsCollapsed] = useState(true);
  const visibleItems = isCollapsed ? items.slice(0, collapseLimit) : items;

  const toggleList = (): void => setIsCollapsed(!isCollapsed);

  return (
    <div className={`${classNameContainer} ${classNameEmptyContainer}`}>
      <div className={styles['user-details__header']}>
        <p className={styles['user-details__title']}>{title}</p>
        <div className={styles['user-details__border']}></div>
      </div>
      <ul className={classNameList}>
        {visibleItems.map((item) => (
          <UserDetailsItem<T> item={item} key={item.id} />
        ))}
      </ul>
      {items.length > collapseLimit ? (
        <Button
          className={styles['user-details__toggle']}
          size="md"
          variant="link"
          color="black"
          icon={isCollapsed ? <Down /> : <Up />}
          onClick={toggleList}
        />
      ) : null}
    </div>
  );
}
