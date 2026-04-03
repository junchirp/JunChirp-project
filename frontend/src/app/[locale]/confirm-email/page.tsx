import AccessGuard from '@/shared/components/AccessGuard/AccessGuard';
import { ReactElement } from 'react';
import styles from './page.module.scss';
import ConfirmEmailContent from './ConfirmEmailContent/ConfirmEmailContent';
import Image from 'next/image';

export default function ConfirmEmail(): ReactElement {
  return (
    <AccessGuard mode="no-verified">
      <div className={styles['confirm-email']}>
        <div className={styles['confirm-email__inner']}>
          <ConfirmEmailContent />
          <Image src="/images/bird-1.svg" alt="bird" width={420} height={662} />
        </div>
      </div>
    </AccessGuard>
  );
}
