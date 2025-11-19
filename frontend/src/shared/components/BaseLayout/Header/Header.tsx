'use client';

import Image from 'next/image';
import Button from '@/shared/components/Button/Button';
import styles from './Header.module.scss';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import authSelector from '@/redux/auth/authSelector';
import { useAppSelector } from '@/hooks/reduxHooks';
import BurgerMenu from './BurgerMenu/BurgerMenu';
import { ReactElement } from 'react';
import { useTranslations } from 'next-intl';

export default function Header(): ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector(authSelector.selectUser);
  const loadingStatus = useAppSelector(authSelector.selectLoadingStatus);
  const isAuthPage =
    pathname === '/auth/login' ||
    pathname === '/auth/registration' ||
    pathname === '/confirm-email' ||
    pathname === '/verify-email';

  const login = (): void => {
    router.push('/auth/login');
  };

  const t = useTranslations('buttons');

  return (
    <header className={styles.header}>
      <div className={styles.header__inner}>
        <Link className={styles.header__link} href="/">
          <Image
            src="/images/logo.svg"
            alt="logo"
            width={134}
            height={76}
            priority
          />
        </Link>
        {loadingStatus !== 'loaded'
          ? null
          : !isAuthPage && (
              <>
                {user?.isVerified ? (
                  <BurgerMenu />
                ) : (
                  <Button
                    color="green"
                    variant="secondary-frame"
                    onClick={login}
                  >
                    {t('login')}
                  </Button>
                )}
              </>
            )}
      </div>
    </header>
  );
}
