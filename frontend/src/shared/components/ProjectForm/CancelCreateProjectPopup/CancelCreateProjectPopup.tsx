'use client';

import { ReactElement } from 'react';
import styles from './CancelCreateProjectPopup.module.scss';
import Button from '@/shared/components/Button/Button';
import { useTranslations } from 'next-intl';

interface CancelCreateProjectPopupProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function CancelCreateProjectPopup(
  props: CancelCreateProjectPopupProps,
): ReactElement {
  const { onCancel, onConfirm } = props;
  const tButtons = useTranslations('buttons');
  const tPopup = useTranslations('cancelCreateProjectPopup');

  return (
    <div className={styles['cancel-create-project-popup__wrapper']}>
      <div className={styles['cancel-create-project-popup']}>
        <div className={styles['cancel-create-project-popup__content']}>
          <h3 className={styles['cancel-create-project-popup__title']}>
            {tPopup('title')}
          </h3>
          <p className={styles['cancel-create-project-popup__text']}>
            {tPopup('description')}
          </p>
        </div>
        <div className={styles['cancel-create-project-popup__actions']}>
          <Button color="green" variant="secondary-frame" onClick={onCancel}>
            {tButtons('cancel')}
          </Button>
          <Button color="green" onClick={onConfirm}>
            {tButtons('confirm')}
          </Button>
        </div>
      </div>
    </div>
  );
}
