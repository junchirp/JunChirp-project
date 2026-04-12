'use client';

import { ReactElement } from 'react';
import styles from './GuestEmptyFooter.module.scss';
import ProjectCardActionsWrapper from '@/shared/components/ProjectCardActionsWrapper/ProjectCardActionsWrapper';
import Button from '@/shared/components/Button/Button';
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
