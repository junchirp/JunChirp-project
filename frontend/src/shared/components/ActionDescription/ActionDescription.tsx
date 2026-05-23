'use client';

import { ReactElement } from 'react';
import styles from './ActionDescription.module.scss';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface ActionDescriptionProps {
  actionKey: string | undefined;
  namespace: string;
}

export default function ActionDescription({
  actionKey,
  namespace,
}: ActionDescriptionProps): ReactElement {
  const t = useTranslations(namespace);

  return (
    <div className={styles['action-description']}>
      {actionKey && (
        <p className={styles['action-description__description']}>
          {t(actionKey)}
        </p>
      )}
      <Image
        src="/images/arrow-right.svg"
        alt="arrow"
        width={160}
        height={160}
      />
    </div>
  );
}
