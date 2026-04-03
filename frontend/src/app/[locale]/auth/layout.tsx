import { ReactElement, ReactNode } from 'react';
import styles from './layout.module.scss';
import Image from 'next/image';
import TabMenuWrapper from './TabMenuWrapper/TabMenuWrapper';
import AccessGuard from '@/shared/components/AccessGuard/AccessGuard';

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <AccessGuard mode="no-auth">
      <div className={styles['auth-layout']}>
        <div className={styles['auth-layout__brackets']}>
          <Image
            className={styles['auth-layout__image']}
            src="/images/brackets.svg"
            alt="brackets"
            fill
          ></Image>
        </div>
        <div className={styles['auth-layout__routes-wrapper']}>
          <TabMenuWrapper />
          <div>{children}</div>
        </div>
      </div>
    </AccessGuard>
  );
}
