'use client';

import { ReactElement } from 'react';
import authSelector from '@/redux/auth/authSelector';
import styles from './SupportPopup.module.scss';
import Button from '@/shared/components/Button/Button';
import X from '@/assets/icons/x.svg';
import SupportForm from '@/shared/components/SupportPopup/SupportForm/SupportForm';
import { useAppSelector } from '@/hooks/reduxHooks';
import { useTranslations } from 'next-intl';

interface SupportPopupProps {
  onClose: () => void;
}

export default function SupportPopup(props: SupportPopupProps): ReactElement {
  const { onClose } = props;
  const user = useAppSelector(authSelector.selectUser);
  const t = useTranslations('support');

  return (
    <div className={styles['support-popup__wrapper']}>
      <div className={styles['support-popup']}>
        <Button
          className={styles['support-popup__close']}
          icon={<X />}
          variant="link"
          color="black"
          size="md"
          onClick={onClose}
        />
        <div className={styles['support-popup__content']}>
          <h3 className={styles['support-popup__title']}>{t('title')}</h3>
          <p className={styles['support-popup__text']}>{t('description')}</p>
        </div>
        <SupportForm user={user} onClose={onClose}></SupportForm>
      </div>
    </div>
  );
}
