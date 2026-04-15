'use client';

import styles from './SocialButton.module.scss';
import { ButtonHTMLAttributes, ReactElement } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useOAuthRedirect } from '@/hooks/useOAuthRedirect';
import { SocialProviderType } from '@/shared/types/social-provider.type';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  iconOnly?: boolean;
  social: SocialProviderType;
  fullWidth?: boolean;
}

export default function SocialButton({
  social,
  iconOnly = false,
  fullWidth = false,
}: ButtonProps): ReactElement {
  const t = useTranslations('buttons');
  const { redirectToOAuth } = useOAuthRedirect();

  const buttonData = {
    google: {
      text: `${t('continueWith')} Google`,
      iconSrc: '/images/google.svg',
    },
    facebook: {
      text: `${t('continueWith')} Facebook`,
      iconSrc: '/images/google.svg',
    },
    discord: {
      text: '',
      iconSrc: '',
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

  const handleSocialLogin = (): void => redirectToOAuth(social);

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
