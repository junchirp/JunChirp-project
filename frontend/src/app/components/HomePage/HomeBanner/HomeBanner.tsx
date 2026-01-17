'use client';

import { ReactElement, useRef } from 'react';
import styles from './HomeBanner.module.scss';
import Button from '@/shared/components/Button/Button';
import Image from 'next/image';
import ArrowUpRight from '@/assets/icons/arrow-up-right.svg';
import { useRouter } from 'next/navigation';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import { useTranslations } from 'next-intl';
import { useElementWidth } from '../../../../hooks/useElementWidth';

interface HomeBannerProps {
  user: AuthInterface | null;
}

export default function HomeBanner({ user }: HomeBannerProps): ReactElement {
  const router = useRouter();
  const tBanner = useTranslations('homeBanner');
  const tButtons = useTranslations('buttons');
  const ref = useRef<HTMLButtonElement>(null);
  const width = useElementWidth(ref);

  const handleRedirect = (): void => {
    router.push(user ? '/projects' : '/auth/registration');
  };

  return (
    <div className={styles['home-banner']}>
      <div className={styles['home-banner__inner']}>
        <div className={styles['home-banner__content']}>
          <Image
            className={styles['home-banner__star']}
            src="/images/star.svg"
            alt="star"
            width={33}
            height={35}
          />
          <div className={styles['home-banner__describe']}>
            <div className={styles['home-banner__title-wrapper']}>
              {user?.isVerified ? (
                <h2 className={styles['home-banner__title']}>
                  {tBanner('authTitleFirst')}
                  <span className={styles['home-banner__title--green']}>
                    [{user.firstName}]
                  </span>
                  {tBanner('authTitleSecond')}
                </h2>
              ) : (
                <h2 className={styles['home-banner__title']}>
                  {tBanner('title')}
                  <span className={styles['home-banner__title--green']}>
                    {tBanner('titleGreen')}
                  </span>
                </h2>
              )}
              {!user?.isVerified && (
                <h3 className={styles['home-banner__sub-title']}>
                  {tBanner('subTitle')}
                </h3>
              )}
            </div>
            {user?.isVerified ? (
              <p className={styles['home-banner__text']}>
                {tBanner('authText')}
              </p>
            ) : (
              <div className={styles['home-banner__text-wrapper']}>
                <p className={styles['home-banner__text']}>
                  {tBanner('textFirst')}
                </p>
                <p className={styles['home-banner__text']}>
                  {tBanner('textSecond')}
                </p>
              </div>
            )}
          </div>
        </div>
        <Image
          src="/images/bird-3.svg"
          alt="bird"
          height={336}
          width={441}
          priority
        />
        <div
          className={styles['home-banner__button-wrapper']}
          style={{ width: width + 8 }}
        >
          <Button
            ref={ref}
            size="lg"
            color="green"
            iconPosition="right"
            icon={<ArrowUpRight />}
            onClick={handleRedirect}
          >
            {tButtons(user?.isVerified ? 'choose' : 'signUp')}
          </Button>
        </div>
      </div>
    </div>
  );
}
