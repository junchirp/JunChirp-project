'use client';

import { ReactElement } from 'react';
import styles from './DiscordBanner.module.scss';
import Image from 'next/image';
import Button from '@/shared/components/Button/Button';
import X from '@/assets/icons/x.svg';
import { useTranslations } from 'next-intl';
import { useOAuthRedirect } from '@/hooks/useOAuthRedirect';
import { DiscordErrorCodeType } from '@/shared/types/discord-error-code.type';

interface DiscordBannerProps {
  closeBanner: () => void;
  errorCode: DiscordErrorCodeType;
  isCancelButton?: boolean;
  withWrapper?: boolean;
}

export default function DiscordBanner(props: DiscordBannerProps): ReactElement {
  const {
    closeBanner,
    errorCode,
    isCancelButton = false,
    withWrapper = false,
  } = props;
  const tButtons = useTranslations('buttons');
  const tDiscord = useTranslations('discord');
  const { redirectToOAuth } = useOAuthRedirect();

  const description =
    errorCode === 'DISCORD_NOT_IN_GUILD'
      ? tDiscord('notInGuildDescription')
      : tDiscord('description');

  const connectButtonText =
    errorCode === 'DISCORD_NOT_IN_GUILD'
      ? tButtons('join')
      : tButtons('connect');

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
      <p className={styles['discord-banner__text']}>{description}</p>
      <div className={styles['discord-banner__actions']}>
        {isCancelButton && (
          <Button color="green" variant="secondary-frame" onClick={closeBanner}>
            {tButtons('cancel')}
          </Button>
        )}
        <Button color="green" onClick={handleDiscordLogin}>
          {connectButtonText}
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
