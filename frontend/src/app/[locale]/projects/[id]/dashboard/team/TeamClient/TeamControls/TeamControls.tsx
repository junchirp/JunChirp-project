'use client';

import { ReactElement } from 'react';
import styles from './TeamControls.module.scss';
import Button from '@/shared/components/Button/Button';
import { TeamTabInterface, TeamTabType } from '@/shared/constants/team';
import { useTranslations } from 'next-intl';

interface TeamControlsProps {
  tabs: TeamTabInterface[];
  onTabChange: (tab: TeamTabType) => void;
}

export default function TeamControls(props: TeamControlsProps): ReactElement {
  const { tabs, onTabChange } = props;
  const t = useTranslations('team');

  return (
    <div className={styles['team-controls']}>
      <div className={styles['team-controls__filters']}>
        {tabs.map((item) => (
          <Button
            key={item.key}
            color="green"
            variant={item.active ? 'primary' : 'secondary-frame'}
            disabled={item.disabled}
            onClick={() => onTabChange(item.key)}
          >
            {t(item.key)} ({item.count})
          </Button>
        ))}
      </div>
    </div>
  );
}
