'use client';

import styles from './SocialButton.module.scss';
import { ButtonHTMLAttributes, ReactElement, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { ToastMessageWithKey } from '@/providers/MessageProvider';
import { useLocale, useTranslations } from 'next-intl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  iconOnly?: boolean;
  social: 'google' | 'facebook';
  fullWidth?: boolean;
  message: ToastMessageWithKey;
}

export default function SocialButton({
  social,
  iconOnly = false,
  fullWidth = false,
  message,
}: ButtonProps): ReactElement {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const locale = useLocale();
  const t = useTranslations('buttons');

  const buttonData = {
    google: {
      text: `${t('continueWith')} Google`,
      iconSrc: '/images/google.svg',
    },
    facebook: {
      text: `${t('continueWith')} Facebook`,
      iconSrc: '/images/google.svg',
    },
  };

  const className = [
    styles['social-button'],
    styles[`social-button--${social}`],
    fullWidth && styles['social-button--full'],
    iconOnly && styles['social-button--icon-button'],
  ]
    .filter(Boolean)
    .join(' ');

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === `${social}_auth_failed`) {
      showToast(message);

      const url = new URL(window.location.href);
      url.searchParams.delete('error');
      router.push(url.pathname);
    }
  }, [searchParams, showToast, router]);

  const handleSocialLogin = (): void => {
    const currentPath = window.location.pathname;
    const returnUrl = encodeURIComponent(currentPath);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    window.location.href = `${baseUrl}/auth/${social}?returnUrl=${returnUrl}&locale=${locale}`;
  };

  return (
    <button className={className} onClick={handleSocialLogin}>
      <Image
        src={buttonData[social].iconSrc}
        alt={social}
        width={24}
        height={24}
      />
      {!iconOnly ? <span>{buttonData[social].text}</span> : null}
    </button>
  );
}
