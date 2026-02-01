'use client';

import React, { ReactElement, useEffect, useRef, useState } from 'react';
import styles from './SocialInvitePopup.module.scss';
import X from '@/assets/icons/x.svg';
import Button from '@/shared/components/Button/Button';
import Input from '@/shared/components/Input/Input';
import Linkedin from '@/assets/icons/linkedin.svg';
import XTwitter from '@/assets/icons/x-twitter.svg';
import Facebook from '@/assets/icons/facebook.svg';
import Telegram from '@/assets/icons/telegram.svg';
import Discord from '@/assets/icons/discord.svg';
import { PlatformType } from '@/shared/types/platform.type';
import { useToast } from '@/hooks/useToast';
import { useTranslations } from 'next-intl';

interface SocialInvitePopupProps {
  onClose: () => void;
  userId: string;
}

const getShareLink = (platform: PlatformType, url: string): string => {
  switch (platform) {
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    case 'telegram':
      return `https://t.me/share/url?url=${encodeURIComponent(url)}`;
    default:
      return url;
  }
};

export default function SocialInvitePopup(
  props: SocialInvitePopupProps,
): ReactElement {
  const { onClose, userId } = props;
  const [inviteUrl, setInviteUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast, isActive } = useToast();
  const tPopup = useTranslations('invitePlatformPopup');
  const tButtons = useTranslations('buttons');

  useEffect(() => {
    const url = `${window.location.origin}?ref=${userId}`;
    setInviteUrl(url);
  }, [userId]);

  const handleClick = async (platform: PlatformType): Promise<void> => {
    if (platform === 'discord') {
      window.open('https://discord.com/channels/@me', '_blank');
      return;
    }

    const shareUrl = getShareLink(platform, inviteUrl);
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  const handleCopy = async (): Promise<void> => {
    if (!inputRef.current || isActive('copy')) {
      return;
    }

    const textToCopy = inputRef.current.value;

    try {
      await navigator.clipboard.writeText(textToCopy);
      showToast({
        severity: 'success',
        summary: tPopup('success'),
        life: 1000,
        actionKey: 'copy',
      });
    } catch {
      showToast({
        severity: 'error',
        summary: tPopup('error'),
        detail: tPopup('details'),
        life: 1000,
        actionKey: 'copy',
      });
    }
  };

  return (
    <div className={styles['social-invite-popup__wrapper']}>
      <div className={styles['social-invite-popup']}>
        <Button
          className={styles['social-invite-popup__close']}
          icon={<X />}
          variant="link"
          color="black"
          size="md"
          onClick={onClose}
        />
        <div className={styles['social-invite-popup__content']}>
          <h3 className={styles['social-invite-popup__title']}>
            {tPopup('title')}
          </h3>
          <p className={styles['social-invite-popup__text']}>
            {tPopup('description')}
          </p>
        </div>
        <div className={styles['social-invite-popup__field']}>
          <Input
            className={styles['social-invite-popup__input']}
            ref={inputRef}
            value={inviteUrl}
            readOnly
          />
          <Button color="green" onClick={handleCopy}>
            {tButtons('copy')}
          </Button>
        </div>
        <div className={styles['social-invite-popup__social-buttons']}>
          <Button
            variant="secondary-frame"
            color="green"
            icon={<Linkedin />}
            onClick={() => handleClick('linkedin')}
          />
          <Button
            variant="secondary-frame"
            color="green"
            icon={<XTwitter />}
            onClick={() => handleClick('twitter')}
          />
          <Button
            variant="secondary-frame"
            color="green"
            icon={<Facebook />}
            onClick={() => handleClick('facebook')}
          />
          <Button
            variant="secondary-frame"
            color="green"
            icon={<Telegram />}
            onClick={() => handleClick('telegram')}
          />
          <Button
            variant="secondary-frame"
            color="green"
            icon={<Discord />}
            onClick={() => handleClick('discord')}
          />
        </div>
      </div>
    </div>
  );
}
