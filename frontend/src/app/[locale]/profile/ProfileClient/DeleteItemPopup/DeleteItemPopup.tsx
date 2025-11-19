'use client';

import { ReactElement } from 'react';
import styles from './DeleteItemPopup.module.scss';
import Button from '@/shared/components/Button/Button';
import { useTranslations } from 'next-intl';

interface DeleteItemPopupProps<T> {
  item: T;
  title: string;
  message: ReactElement<HTMLParagraphElement>;
  onCancel: () => void;
  loading: boolean;
  onConfirm: (item: T) => void;
}

export default function DeleteItemPopup<T>(
  props: DeleteItemPopupProps<T>,
): ReactElement {
  const { item, title, message, onCancel, onConfirm, loading } = props;
  const t = useTranslations('buttons');

  return (
    <div className={styles['delete-item-popup__wrapper']}>
      <div className={styles['delete-item-popup']}>
        <div className={styles['delete-item-popup__content']}>
          <h3 className={styles['delete-item-popup__title']}>{title}</h3>
          {message}
        </div>
        <div className={styles['delete-item-popup__actions']}>
          <Button color="green" variant="secondary-frame" onClick={onCancel}>
            {t('cancel')}
          </Button>
          <Button
            color="green"
            loading={loading}
            onClick={() => onConfirm(item)}
          >
            {t('delete')}
          </Button>
        </div>
      </div>
    </div>
  );
}
