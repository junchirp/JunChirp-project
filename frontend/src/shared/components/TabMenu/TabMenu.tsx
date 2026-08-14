'use client';

import { ReactElement } from 'react';
import styles from './TabMenu.module.scss';

export interface TabMenuItem {
  label: string;
  disabled?: boolean;
  command?: () => void;
}

export interface TabMenuProps {
  model: TabMenuItem[];
  activeIndex?: number;
  variant?: 'default' | 'auth';
}

export default function TabMenu({
  model,
  activeIndex = 0,
  variant = 'default',
}: TabMenuProps): ReactElement {
  const tabMenuClasses = [
    styles['tab-menu'],
    styles[`tab-menu--${variant}`],
  ].join(' ');

  return (
    <div className={tabMenuClasses}>
      {model.map((item, index) => {
        const isActive = index === activeIndex;
        const classNames = [
          styles['tab-menu__item'],
          styles[`tab-menu__item--${variant}`],
          isActive && styles['tab-menu__item--active'],
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <button
            key={index}
            className={classNames}
            disabled={item.disabled}
            onClick={item.command}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
