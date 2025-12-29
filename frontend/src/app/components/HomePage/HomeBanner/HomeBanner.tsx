'use client';

import { ReactElement } from 'react';
import styles from './HomeBanner.module.scss';
import Button from '@/shared/components/Button/Button';
import Image from 'next/image';
import ArrowUpRight from '@/assets/icons/arrow-up-right.svg';
import { useRouter } from 'next/navigation';
import { AuthInterface } from '@/shared/interfaces/auth.interface';

interface HomeBannerProps {
  user: AuthInterface | null;
}

export default function HomeBanner({ user }: HomeBannerProps): ReactElement {
  const router = useRouter();

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
                  Вітаємо,{' '}
                  <span className={styles['home-banner__title--green']}>
                    [{user.firstName}]
                  </span>
                  ! Готовий до нових викликів?
                </h2>
              ) : (
                <h2 className={styles['home-banner__title']}>
                  Від новачка до{' '}
                  <span className={styles['home-banner__title--green']}>
                    [професіонала]
                  </span>
                </h2>
              )}
              {!user?.isVerified && (
                <h3 className={styles['home-banner__sub-title']}>
                  Твоя IT-кар'єра починається тут!
                </h3>
              )}
            </div>
            {user?.isVerified ? (
              <p className={styles['home-banner__text']}>
                Обирай проєкт, прокачуй навички та зроби перший крок у реальних
                IT-розробках!
              </p>
            ) : (
              <div className={styles['home-banner__text-wrapper']}>
                <p className={styles['home-banner__text']}>
                  Реєструйся на платформі для джуніорів IT та отримуй доступ до
                  реальних проєктів для розвитку своїх навичок.
                </p>
                <p className={styles['home-banner__text']}>
                  Тренуйся, працюй над проєктами та ставай експертом!
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
        <div className={styles['home-banner__button-wrapper']}>
          <Button
            size="lg"
            color="green"
            iconPosition="right"
            icon={<ArrowUpRight />}
            fullWidth
            onClick={handleRedirect}
          >
            {user?.isVerified ? 'Обрати' : 'Зареєструватися'}
          </Button>
        </div>
      </div>
    </div>
  );
}
