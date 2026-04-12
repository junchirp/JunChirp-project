'use client';

import { ReactElement } from 'react';
import styles from './GuestClosedFooter.module.scss';
import ProjectCardActionsWrapper from '@/shared/components/ProjectCardActionsWrapper/ProjectCardActionsWrapper';
import Button from '@/shared/components/Button/Button';
import { useTranslations } from 'next-intl';

interface GuestClosedFooterProps {
  publicUrl: string | null;
  size: 'small' | 'large';
}

export default function GuestClosedFooter({
  publicUrl,
  size,
}: GuestClosedFooterProps): ReactElement | null {
  const tButtons = useTranslations('buttons');

  const viewWebSite = (): void => {
    if (publicUrl) {
      window.open(publicUrl, '_blank');
    }
  };

  return (
    <div className={styles['guest-closed-footer']}>
      {publicUrl ? (
        <ProjectCardActionsWrapper size={size}>
          <Button color="green" onClick={viewWebSite}>
            {tButtons('viewWebSite')}
          </Button>
        </ProjectCardActionsWrapper>
      ) : null}
    </div>
  );
}
