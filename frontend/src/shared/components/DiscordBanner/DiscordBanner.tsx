'use client';

import { ReactElement } from 'react';
import styles from './DiscordBanner.module.scss';
import Image from 'next/image';
import Button from '@/shared/components/Button/Button';
import X from '@/assets/icons/x.svg';
import { useTranslations } from 'next-intl';
import { useOAuthRedirect } from '@/hooks/useOAuthRedirect';

interface DiscordBannerProps {
  closeBanner: () => void;
  message: string;
  isCancelButton?: boolean;
  withWrapper?: boolean;
}

export default function DiscordBanner(props: DiscordBannerProps): ReactElement {
  const {
    closeBanner,
    message,
    isCancelButton = false,
    withWrapper = false,
  } = props;
  const t = useTranslations('buttons');
  const { redirectToOAuth } = useOAuthRedirect();

  const handleDiscordLogin = (): void => redirectToOAuth('discord');

  const content = (
    <>
      <Image
        src="/images/bird-2.svg"
        alt="bird"
        width={420}
        height={223}
        priority
      />
      <p className={styles['discord-banner__text']}>{message}</p>
      <div className={styles['discord-banner__actions']}>
        {isCancelButton && (
          <Button color="green" variant="secondary-frame" onClick={closeBanner}>
            {t('cancel')}
          </Button>
        )}
        <Button color="green" onClick={handleDiscordLogin}>
          {isCancelButton ? `${t('connect')}` : `${t('connect')} Discord`}
        </Button>
      </div>
      <Button
        className={styles['discord-banner__close']}
        icon={<X />}
        variant="link"
        color="black"
        size="md"
        onClick={closeBanner}
      />
    </>
  );

  return (
    <>
      {withWrapper ? (
        <div className={styles['discord-banner__wrapper']}>
          <div className={styles['discord-banner']}>{content}</div>
        </div>
      ) : (
        <div
          className={`${styles['discord-banner']} ${styles['discord-banner--base']}`}
        >
          {content}
        </div>
      )}
    </>
  );
}
