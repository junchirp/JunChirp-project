import { ReactElement, ReactNode } from 'react';
import styles from './layout.module.scss';
import Image from 'next/image';
import AuthTabs from '@/app/[locale]/auth/AuthTabs/AuthTabs';

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <div className={styles['auth-layout']}>
      <div className={styles['auth-layout__brackets']}>
        <Image
          className={styles['auth-layout__image']}
          src="/images/brackets.svg"
          alt="brackets"
          fill
          priority
        />
      </div>
      <div className={styles['auth-layout__routes-wrapper']}>
        <AuthTabs />
        <div>{children}</div>
      </div>
    </div>
  );
}
