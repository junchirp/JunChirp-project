'use client';

import { ReactElement, useState } from 'react';
import styles from './CallToAction.module.scss';
import Image from 'next/image';
import Button from '@/shared/components/Button/Button';
import { useRouter } from 'next/navigation';
import SocialInvitePopup from './SocialInvitePopup/SocialInvitePopup';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import { useTranslations } from 'next-intl';

interface CallToActionProps {
  user: AuthInterface | null;
}

export default function CallToAction({
  user,
}: CallToActionProps): ReactElement {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const tButtons = useTranslations('buttons');
  const tCallToAction = useTranslations('callToAction');

  const handleRegistration = (): void => {
    router.push('/auth/registration');
  };

  const openPopup = (): void => setIsOpen(true);
  const closePopup = (): void => setIsOpen(false);

  return (
    <>
      <div className={styles['call-to-action']}>
        <div className={styles['call-to-action__inner']}>
          <div className={styles['call-to-action__content']}>
            <div className={styles['call-to-action__description']}>
              {user?.isVerified ? (
                <h2 className={styles['call-to-action__header']}>
                  {tCallToAction('auth.title')}
                </h2>
              ) : (
                <h2 className={styles['call-to-action__header']}>
                  {tCallToAction('noAuth.title')}
                </h2>
              )}
              {user?.isVerified ? (
                <div className={styles['call-to-action__text']}>
                  <p>{tCallToAction('auth.paragraphOne')}</p>
                  <p>{tCallToAction('auth.paragraphTwo')}</p>
                </div>
              ) : (
                <div className={styles['call-to-action__text']}>
                  <p>{tCallToAction('noAuth.paragraphOne')}</p>
                  <p>{tCallToAction('noAuth.paragraphTwo')}</p>
                  <p>{tCallToAction('noAuth.paragraphThree')}</p>
                </div>
              )}
            </div>
            {user?.isVerified ? (
              <Button color="green" onClick={openPopup}>
                {tButtons('inviteToPlatform')}
              </Button>
            ) : (
              <Button color="green" onClick={handleRegistration}>
                {tButtons('signUp')}
              </Button>
            )}
          </div>
          <Image src="/images/bird-4.svg" alt="bird" width={420} height={352} />
        </div>
      </div>
      {user?.isVerified && isOpen && (
        <SocialInvitePopup onClose={closePopup} userId={user.id} />
      )}
    </>
  );
}
