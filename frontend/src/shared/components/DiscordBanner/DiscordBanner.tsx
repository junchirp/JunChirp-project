'use client';

import { ReactElement, useEffect } from 'react';
import styles from './DiscordBanner.module.scss';
import Image from 'next/image';
import Button from '@/shared/components/Button/Button';
import X from '@/assets/icons/x.svg';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/useToast';

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
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'discord_auth_failed') {
      showToast({
        severity: 'error',
        summary: 'Не вдалося підтвердити Discord',
        detail: 'Спробуй ще раз.',
        life: 3000,
        actionKey: 'discord',
      });
    }
  }, [searchParams, showToast]);

  const handleDiscordLogin = (): void => {
    const currentPath = window.location.pathname;
    const returnUrl = encodeURIComponent(currentPath);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    window.location.href = `${baseUrl}/auth/discord?returnUrl=${returnUrl}`;
  };

  const content = (
    <>
      <Image
        src="./images/bird-2.svg"
        alt="bird"
        width={420}
        height={223}
        priority
      />
      <p className={styles['discord-banner__text']}>{message}</p>
      <div className={styles['discord-banner__actions']}>
        {isCancelButton && (
          <Button color="green" variant="secondary-frame" onClick={closeBanner}>
            Скасувати
          </Button>
        )}
        <Button color="green" onClick={handleDiscordLogin}>
          Підключити
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
