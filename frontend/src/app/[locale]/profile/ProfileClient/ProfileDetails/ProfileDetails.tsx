'use client';

import { ReactElement, useState } from 'react';
import styles from './ProfileDetails.module.scss';
import Button from '@/shared/components/Button/Button';
import Plus from '@/assets/icons/plus.svg';
import { SoftSkillInterface } from '@/shared/interfaces/soft-skill.interface';
import { HardSkillInterface } from '@/shared/interfaces/hard-skill.interface';
import { EducationInterface } from '@/shared/interfaces/education.interface';
import { SocialInterface } from '@/shared/interfaces/social.interface';
import ProfileDetailsItem from './ProfileDetailsItem/ProfileDetailsItem';
import Up from '@/assets/icons/chevron-up.svg';
import Down from '@/assets/icons/chevron-down.svg';
import { WithIdInterface } from '@/shared/interfaces/with-id.interface';
import DataContainer from '@/shared/components/DataContainer/DataContainer';
import { useTranslations } from 'next-intl';

interface ProfileDetailsProps<
  T extends WithIdInterface =
    | SoftSkillInterface
    | HardSkillInterface
    | EducationInterface
    | SocialInterface,
> {
  title: string;
  isEditable?: boolean;
  items: T[];
  maxSize: number;
  handleAddItem: () => void;
  handleEditItem?: (item: T) => void;
  handleDeleteItem: (item: T) => void;
}

const COLLAPSE_LIMIT = 5;

export default function ProfileDetails<T extends WithIdInterface>(
  props: ProfileDetailsProps<T>,
): ReactElement {
  const {
    title,
    isEditable = false,
    items,
    maxSize,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
  } = props;
  const [isCollapsed, setIsCollapsed] = useState(true);
  const visibleItems = isCollapsed ? items.slice(0, COLLAPSE_LIMIT) : items;
  const t = useTranslations('profile');

  const toggleList = (): void => setIsCollapsed(!isCollapsed);

  return (
    <div className={styles['profile-details']}>
      {items.length ? (
        <DataContainer
          title={title}
          counterMaxSize={maxSize}
          counterSize={items.length}
          verticalGap={20}
        >
          <>
            <div className={styles['profile-details__content']}>
              <ul className={styles['profile-details__list']}>
                {visibleItems.map((item) => (
                  <ProfileDetailsItem<T>
                    item={item}
                    isEditable={isEditable}
                    key={item.id}
                    handleEditItem={handleEditItem}
                    handleDeleteItem={handleDeleteItem}
                  />
                ))}
              </ul>
              {items.length > COLLAPSE_LIMIT ? (
                <Button
                  className={styles['profile-details__toggle']}
                  size="md"
                  variant="link"
                  color="black"
                  icon={isCollapsed ? <Down /> : <Up />}
                  onClick={toggleList}
                />
              ) : null}
            </div>
            <Button
              color="green"
              fullWidth
              icon={<Plus />}
              disabled={items.length === maxSize}
              onClick={handleAddItem}
            >
              {t('addBtn')}
            </Button>
          </>
        </DataContainer>
      ) : (
        <div className={styles['profile-details__empty']}>
          <div className={styles['profile-details__title']}>{title}</div>
          <Button
            color="green"
            fullWidth
            icon={<Plus />}
            onClick={handleAddItem}
          >
            {t('addBtn')}
          </Button>
        </div>
      )}
    </div>
  );
}
