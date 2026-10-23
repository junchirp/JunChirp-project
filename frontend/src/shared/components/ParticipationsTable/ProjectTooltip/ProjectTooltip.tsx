'use client';

import { ReactElement } from 'react';
import styles from './ProjectTooltip.module.scss';

interface ProjectTooltipProps {
  projectName: string;
}

export default function ProjectTooltip({
  projectName,
}: ProjectTooltipProps): ReactElement {
  return <div className={styles['project-tooltip']}>{projectName}</div>;
}
