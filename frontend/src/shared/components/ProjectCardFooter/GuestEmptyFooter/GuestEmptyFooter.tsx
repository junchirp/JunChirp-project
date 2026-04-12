'use client';

import { ReactElement } from 'react';
import styles from './GuestEmptyFooter.module.scss';
import ProjectCardActionsWrapper from '../ProjectCardActionsWrapper/ProjectCardActionsWrapper';
import Button from '../../Button/Button';
import { useTranslations } from 'next-intl';

interface GuestEmptyFooterProps {
  size: 'small' | 'large';
}

export default function GuestEmptyFooter({
  size,
}: GuestEmptyFooterProps): ReactElement {
  const tButtons = useTranslations('buttons');

  return (
    <div className={styles['guest-empty-footer']}>
      <ProjectCardActionsWrapper size={size}>
        <Button color="green" disabled>
          {tButtons('sendRequest')}
        </Button>
      </ProjectCardActionsWrapper>
    </div>
  );
}
