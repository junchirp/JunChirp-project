'use client';

import { ReactElement, ReactNode } from 'react';
import styles from './ToolbarButton.module.scss';

interface ToolbarButtonProps {
  active: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
}

export default function ToolbarButton({
  active,
  label,
  onClick,
  children,
}: ToolbarButtonProps): ReactElement {
  const buttonClasses = [
    styles['toolbar-button'],
    active && styles['toolbar-button--active'],
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={buttonClasses}
      type="button"
      aria-label={label}
      aria-pressed={active}
      onMouseDown={(e) => {
        e.preventDefault();
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
