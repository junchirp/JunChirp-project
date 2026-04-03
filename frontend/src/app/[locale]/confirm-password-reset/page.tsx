import { ReactElement } from 'react';
import styles from './page.module.scss';
import Image from 'next/image';
import ConfirmPasswordResetContent from './ConfirmPasswordResetContent/ConfirmPasswordResetContent';
import AccessGuard from '@/shared/components/AccessGuard/AccessGuard';

export default function ConfirmPasswordReset(): ReactElement {
  return (
    <AccessGuard mode="no-auth">
      <div className={styles['confirm-password-reset']}>
        <div className={styles['confirm-password-reset__inner']}>
          <Image src="/images/bird-1.svg" alt="bird" width={420} height={662} />
          <ConfirmPasswordResetContent />
        </div>
      </div>
    </AccessGuard>
  );
}
