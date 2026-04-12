'use client';

import { ReactElement } from 'react';
import styles from './ProjectCardActionsWrapper.module.scss';

interface ProjectCardActionsWrapperProps {
  children: ReactElement | ReactElement[];
  size: 'large' | 'small';
}

export default function ProjectCardActionsWrapper({
  children,
  size,
}: ProjectCardActionsWrapperProps): ReactElement {
  return (
    <div
      className={`
        ${styles['project-card-actions-wrapper']}
        ${
          size === 'small'
            ? styles['project-card-actions-wrapper--small']
            : styles['project-card-actions-wrapper--large']
        }
      `}
    >
      {children}
    </div>
  );
}
