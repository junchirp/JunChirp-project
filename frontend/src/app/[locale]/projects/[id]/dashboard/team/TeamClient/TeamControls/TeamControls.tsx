'use client';

import { ReactElement } from 'react';
import styles from './TeamControls.module.scss';
import Button from '@/shared/components/Button/Button';
import {
  TeamTabInterface,
  TeamTabType,
  TeamViewType,
} from '@/shared/constants/team';
import { InputSwitch } from 'primereact/inputswitch';
import { useTranslations } from 'next-intl';

interface TeamControlsProps {
  tabs: TeamTabInterface[];
  view: TeamViewType;
  onTabChange: (tab: TeamTabType) => void;
  onViewChange: (view: TeamViewType) => void;
}

export default function TeamControls(props: TeamControlsProps): ReactElement {
  const { tabs, view, onViewChange, onTabChange } = props;
  const t = useTranslations('team');

  const changeView = (): void => {
    onViewChange(view === 'flat' ? 'grouped' : 'flat');
  };

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
      <div className={styles['team-controls__view']}>
        <InputSwitch checked={view === 'grouped'} onChange={changeView} />
        {t('group')}
      </div>
    </div>
  );
}
