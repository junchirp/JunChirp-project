'use client';

import { ReactElement, useState } from 'react';
import styles from './CallToAction.module.scss';
import Image from 'next/image';
import Button from '@/shared/components/Button/Button';
import { useRouter } from 'next/navigation';
import SocialInvitePopup from './SocialInvitePopup/SocialInvitePopup';
import { AuthInterface } from '../../../../shared/interfaces/auth.interface';

interface CallToActionProps {
  user: AuthInterface | null;
}

export default function CallToAction({
  user,
}: CallToActionProps): ReactElement {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

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
                  Створювати щось велике разом з друзями &mdash; це завжди
                  круто!
                </h2>
              ) : (
                <h2 className={styles['call-to-action__header']}>
                  Тепер твій момент!
                </h2>
              )}
              {user?.isVerified ? (
                <div className={styles['call-to-action__text']}>
                  <p>
                    Запроси своїх знайомих, об'єднайтесь, генеруйте ідеї та
                    створюйте інноваційні проєкти, які змінять світ!
                  </p>
                  <p>
                    Коли працюєш з тими, кого знаєш, процес стає ще більш
                    захоплюючим та надихаючим. Разом досягнемо більше!
                  </p>
                </div>
              ) : (
                <div className={styles['call-to-action__text']}>
                  <p>
                    Долистав до кінця? Тепер вибір за тобою! Час не чекає. Зараз
                    твоя черга: залишайся спостерігачем або починай підкорювати
                    нові горизонти!
                  </p>
                  <p>Реєструйся і зроби перший крок до своєї кар'єри в ІТ.</p>
                  <p>Успіх чекає на тебе!</p>
                </div>
              )}
            </div>
            {user?.isVerified ? (
              <Button color="green" onClick={openPopup}>
                Запросити
              </Button>
            ) : (
              <Button color="green" onClick={handleRegistration}>
                Зареєструватись
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
